const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/userModel');

describe('User Authentication', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    // Clean up database and close connection
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear users before each test
    await User.deleteMany({});
  });

  // Test user registration
test('Should register a new user', async () => {
    const response = await request(app)
        .post('/api/auth/register') // Assuming this is the correct endpoint
        .send({
            username: 'testuser',
            password: 'testpassword'
        });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
});
