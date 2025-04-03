# Event Locator App

## Description
The Event Locator App is a web application that helps users find events based on their preferences and location. It allows users to register, log in, and view events categorized by their interests.

## Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- Nodemon
- dotenv

## Installation Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/event-locator-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd event-locator-app/event-locator-backend
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add your MongoDB URI:
   ```
   MONGODB_URI=your_mongodb_uri
   ```

## Usage Instructions
1. Start the server:
   ```bash
   npm run dev
   ```
2. The server will run on `http://localhost:5000`.

## API Endpoints
- `GET /categories`: List of categories.
- `GET /events`: List of events.
- `POST /users/register`: Register a new user.
- `POST /users/login`: Log in an existing user.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## License
This project is licensed under the MIT License.
