
// require('dotenv').config();
// const express = require('express');
// const { sequelize } = require('./config/database');
// const userRoutes = require('./routes/userRoutes');
// const eventRoutes = require('./routes/eventRoutes');
// const searchRoutes = require('./routes/searchRoutes');
// const notificationService = require('./services/notificationService');

// const app = express();

// app.use(express.json());


// app.use('/api/users', userRoutes);
// app.use('/api/events', eventRoutes);
// app.use('/api/search', searchRoutes);


// app.use((err, req, res, next) => {
//   res.status(err.status || 500).json({
//     error: {
//       message: err.message
//     }
//   });
// });

// const PORT = process.env.PORT || 5000;

// async function startServer() {
//   try {
//     await sequelize.authenticate();
//     await sequelize.sync();
//     await notificationService.startListening();
//     console.log('Database connected successfully');
    
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// }

// startServer();


require('dotenv').config();
const express = require('express');
const { sequelize } = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const searchRoutes = require('./routes/searchRoutes');
const notificationService = require('./services/notificationService');

const app = express();

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/search', searchRoutes);

// Error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message
    }
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    
    // Start notification service (will work in mock mode)
    await notificationService.startListening();
    
    console.log('✅ Database connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Startup failed:', error);
    process.exit(1);
  }
}

startServer();