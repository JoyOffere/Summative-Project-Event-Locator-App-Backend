# Event Locator App - Backend

A multi-user event locator application backend built with Node.js, Express, PostgreSQL with PostGIS, and Redis. This application allows users to discover events based on their location and preferences, with features for geospatial searches, multilingual support, and asynchronous notifications.

## Features

### User Management
- Secure user registration and login with JWT authentication
- Password hashing using bcrypt
- User profile with location data (stored as geographic points)
- Preference settings for event categories and language

### Event Management
- Full CRUD operations for events
- Event details including title, description, location (latitude/longitude), date/time
- Event categorization system
- Support for event ratings and reviews

### Location-Based Functionality
- Find events within a specified radius of user location
- Efficient geospatial queries using PostGIS
- Category filtering for search results
- Distance-based sorting of search results

### Internationalization (i18n)
- Support for multiple languages (English, Spanish, French)
- User-selectable interface language
- Localized notifications and system messages

### Notification System
- Asynchronous processing using Redis Pub/Sub
- Targeted notifications based on user preferences and location
- Scheduled notifications for upcoming events
- Read status tracking for notifications

### Additional Features
- Event rating and review system
- Favorite events functionality
- Real-time updates for event changes

## Technical Architecture

### Database Schema
The application uses PostgreSQL with the PostGIS extension for geospatial data:

#### Tables
1. **users**
   - id (PK)
   - email (unique)
   - password (hashed)
   - name
   - location (geography point)
   - language
   - created_at
   - updated_at

2. **events**
   - id (PK)
   - title
   - description
   - location (geography point)
   - start_date
   - end_date
   - created_by (FK to users)
   - created_at
   - updated_at

3. **categories**
   - id (PK)
   - name
   - description

4. **event_categories** (junction table)
   - event_id (FK to events)
   - category_id (FK to categories)

5. **user_preferences** (junction table)
   - user_id (FK to users)
   - category_id (FK to categories)

6. **notifications**
   - id (PK)
   - user_id (FK to users)
   - event_id (FK to events)
   - message
   - scheduled_for
   - sent
   - read
   - created_at

7. **event_ratings**
   - id (PK)
   - event_id (FK to events)
   - user_id (FK to users)
   - rating
   - review
   - created_at

8. **favorites**
   - user_id (FK to users)
   - event_id (FK to events)
   - created_at

### Technology Stack
- **Backend Framework**: Node.js with Express.js
- **Database**: PostgreSQL 14 with PostGIS extension for geospatial data
- **Queuing System**: Redis for asynchronous notification processing
- **Authentication**: JWT tokens with bcrypt for password hashing
- **Internationalization**: i18next library for multilingual support
- **Testing**: Jest for unit and integration testing
- **API Documentation**: Swagger/OpenAPI

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- PostgreSQL 14+ with PostGIS extension
- Redis 6+
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/event-locator-backend.git
   cd event-locator-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env` file:
   ```
   # Server
   PORT=3000
   NODE_ENV=development
   
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=event_locator
   DB_USER=postgres
   DB_PASSWORD=yourpassword
   
   # Redis
   REDIS_HOST=localhost
   REDIS_PORT=6379
   
   # JWT
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRATION=24h
   ```

4. Set up the PostgreSQL database with PostGIS:
   ```sql
   CREATE DATABASE event_locator;
   \c event_locator
   CREATE EXTENSION postgis;
   ```

5. Run database migrations:
   ```bash
   npm run db:migrate
   ```

6. (Optional) Seed the database with sample data:
   ```bash
   npm run db:seed
   ```

7. Start the server:
   ```bash
   npm start
   ```

8. For development with auto-reload:
   ```bash
   npm run dev
   ```

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- tests/user.test.js
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "preferredCategories": [1, 3, 5],
  "language": "en"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token_here"
}
```

#### POST /api/auth/login
Log in a user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token_here"
}
```

### Event Endpoints

#### GET /api/events
Get events with optional filtering.

**Query Parameters:**
- `latitude`: User's latitude (required for proximity search)
- `longitude`: User's longitude (required for proximity search)
- `radius`: Search radius in kilometers (default: 10)
- `categories`: Comma-separated list of category IDs
- `startDate`: Filter events starting after this date
- `endDate`: Filter events ending before this date

**Response:**
```json
{
  "events": [
    {
      "id": 1,
      "title": "Tech Conference 2025",
      "description": "Annual tech innovation showcase",
      "location": {
        "type": "Point",
        "coordinates": [-122.4167, 37.7833]
      },
      "distance": 1.2,
      "startDate": "2025-06-15T09:00:00Z",
      "endDate": "2025-06-17T18:00:00Z",
      "categories": [
        {"id": 2, "name": "Technology"}
      ],
      "isFavorite": false
    }
  ],
  "total": 1
}
```

#### POST /api/events
Create a new event.

**Request Body:**
```json
{
  "title": "Tech Conference 2025",
  "description": "Annual tech innovation showcase",
  "location": {
    "latitude": 37.7833,
    "longitude": -122.4167
  },
  "startDate": "2025-06-15T09:00:00Z",
  "endDate": "2025-06-17T18:00:00Z",
  "categories": [2, 4]
}
```

**Response:**
```json
{
  "message": "Event created successfully",
  "event": {
    "id": 1,
    "title": "Tech Conference 2025",
    "description": "Annual tech innovation showcase",
    "location": {
      "type": "Point",
      "coordinates": [-122.4167, 37.7833]
    },
    "startDate": "2025-06-15T09:00:00Z",
    "endDate": "2025-06-17T18:00:00Z",
    "categories": [2, 4]
  }
}
```

For complete API documentation, see [API.md](./API.md) or run the server and visit `/api-docs` for interactive Swagger documentation.

## Architecture Decisions

### Why PostgreSQL with PostGIS?
We chose PostgreSQL with the PostGIS extension to efficiently handle geospatial data and queries. PostGIS provides specialized functions like `ST_DWithin` for proximity searches, which are essential for a location-based application. The spatial indexing capabilities dramatically improve performance for radius searches.

### Why Redis for Notifications?
Redis Pub/Sub provides an efficient way to handle asynchronous notification processing. It allows us to:
1. Queue notifications without blocking the main application flow
2. Schedule notifications for future delivery using sorted sets
3. Scale notification processing independently from the main application

### Testing Strategy
The project uses Jest for comprehensive testing:
- Unit tests for individual functions and components
- Integration tests for API endpoints
- Mock objects for external dependencies like Redis
- Special handling for testing asynchronous operations

## Future Enhancements
- Real-time event updates using WebSockets
- Enhanced search filters (price, popularity, etc.)
- Social features (invite friends, share events)
- Push notifications for mobile devices
- Machine learning recommendations based on user preferences

## Contributors
- Joy Offere - Project Lead & Developer

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
