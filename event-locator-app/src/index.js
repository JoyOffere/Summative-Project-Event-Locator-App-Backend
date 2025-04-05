require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const pool = require('./db');

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server with CORS configuration
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// CORS middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Redis setup for notifications
const publisher = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

const subscriber = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

// Connect Redis clients
(async () => {
  try {
    await publisher.connect();
    console.log('Redis publisher connected');
    await subscriber.connect();
    console.log('Redis subscriber connected');

    // Subscribe to event notifications and broadcast to connected clients
    await subscriber.subscribe('event_notifications', (message) => {
      console.log(`Notification: ${message}`);
      // Broadcast the notification to all connected clients
      io.emit('notification', message);
    });
  } catch (err) {
    console.error('Redis connection failed:', err);
  }
})();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send a welcome message to the connected client
  socket.emit('notification', 'Connected to event notification system');

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  // Handle tokens with Bearer prefix
  const tokenValue = token.startsWith('Bearer ') ? token.slice(7) : token;

  jwt.verify(tokenValue, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// User Management
app.post('/register', async (req, res) => {
  const { username, password, latitude, longitude } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, location) VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326)) RETURNING id',
      [username, hashedPassword, longitude, latitude]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== EVENT ROUTES =====
// Create a separate router for events
const eventRouter = express.Router();

// Apply authentication middleware to all event routes
eventRouter.use(authenticateToken);

// Create new event
eventRouter.post('/', async (req, res) => {
  const { title, description, latitude, longitude, date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO events (title, description, location, date, user_id) VALUES ($1, $2, ST_SetSRID(ST_MakePoint($3, $4), 4326), $5, $6) RETURNING id, title',
      [title, description, longitude, latitude, date, req.user.id]
    );
    const eventId = result.rows[0].id;

    // Format date for notification
    const eventDate = new Date(date);
    const formattedDate = eventDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    try {
      // Send a more user-friendly notification
      await publisher.publish(
        'event_notifications',
        `New event: "${title}" on ${formattedDate}`
      );
    } catch (redisErr) {
      console.error('Failed to publish notification:', redisErr);
    }

    res.status(201).json({ id: eventId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get nearby events - define this BEFORE the :id route
eventRouter.get('/nearby', async (req, res) => {
  const radius = req.query.radius || 5000; // Default to 5km if not provided

  try {
    // Get the user's location
    const userResult = await pool.query('SELECT location FROM users WHERE id = $1', [req.user.id]);

    // Check if user has a location
    if (!userResult.rows.length || !userResult.rows[0].location) {
      return res.status(400).json({
        error: 'User location not found. Please update your profile with a location.'
      });
    }

    const userLocation = userResult.rows[0].location;

    // Get nearby events with error handling
    const events = await pool.query(
      'SELECT id, title, description, date, ST_AsText(location) AS location ' +
      'FROM events WHERE ST_DWithin(location, $1, $2)',
      [userLocation, radius]
    );

    // Return results, even if empty
    res.json(events.rows);
  } catch (err) {
    console.error('Error in nearby events query:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get event by ID
eventRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT id, title, description, ST_AsText(location) AS location, date FROM events WHERE id = $1',
      [id]
    );
    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update event
eventRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, latitude, longitude, date } = req.body;
  try {
    const updateResult = await pool.query(
      'UPDATE events SET title = $1, description = $2, location = ST_SetSRID(ST_MakePoint($3, $4), 4326), date = $5 WHERE id = $6 AND user_id = $7 RETURNING title',
      [title, description, longitude, latitude, date, id, req.user.id]
    );

    if (updateResult.rowCount > 0) {
      try {
        // Format date for notification
        const eventDate = new Date(date);
        const formattedDate = eventDate.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        // Notify about the update
        await publisher.publish(
          'event_notifications',
          `Event updated: "${title}" on ${formattedDate}`
        );
      } catch (redisErr) {
        console.error('Failed to publish update notification:', redisErr);
      }
    }

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete event
eventRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Get event title before deletion for notification
    const eventResult = await pool.query(
      'SELECT title FROM events WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );

    if (eventResult.rows.length > 0) {
      const eventTitle = eventResult.rows[0].title;

      // Delete the event
      await pool.query('DELETE FROM events WHERE id = $1 AND user_id = $2', [id, req.user.id]);

      try {
        // Notify about the deletion
        await publisher.publish(
          'event_notifications',
          `Event deleted: "${eventTitle}"`
        );
      } catch (redisErr) {
        console.error('Failed to publish deletion notification:', redisErr);
      }
    }

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mount the event router
app.use('/events', eventRouter);

// Use server.listen instead of app.listen
server.listen(3000, () => console.log('Server running on port 3000'));