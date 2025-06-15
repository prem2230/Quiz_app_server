# MERN Quiz Application - Backend

A robust RESTful API for a quiz application built with Node.js, Express, and MongoDB. This backend service provides authentication, quiz creation, and question management functionality.

## Features

- **User Authentication**: Secure registration and login with JWT
- **Role-Based Access Control**: Admin and regular user roles
- **Quiz Management**: Create, read, update, and delete quizzes
- **Question Management**: Create, read, update, and delete questions
- **Data Validation**: Comprehensive validation for all inputs
- **Error Handling**: Detailed error responses

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication mechanism
- **bcrypt**: Password hashing

## API Endpoints

### Authentication
- `POST /api/user/register`: Register a new user
- `POST /api/user/login`: Login and receive JWT token
- `GET /api/user/profile`: Get user profile (requires authentication)

### Questions
- `POST /api/question/create-question`: Create a new question (admin only)
- `GET /api/question/get-question/:id`: Get a specific question
- `PUT /api/question/update-question/:id`: Update a question (admin only)
- `GET /api/question/get-questions`: Get all questions with pagination
- `DELETE /api/question/delete-question/:id`: Delete a question (admin only)

### Quizzes
- `POST /api/quiz/create-quiz`: Create a new quiz (admin only)
- `GET /api/quiz/get-quiz/:id`: Get a specific quiz
- `GET /api/quiz/get-quizzes`: Get all quizzes with pagination and search
- `PUT /api/quiz/update-quiz/:id`: Update a quiz (admin only)
- `DELETE /api/quiz/delete-quiz/:id`: Delete a quiz (admin only)

## Data Models

### User
- Email (unique)
- Username (unique)
- Password (hashed)
- Role (admin/user)
- Phone Number (unique)

### Question
- Question text
- Options (array of text and isCorrect flag)
- Explanation
- Marks
- Created by (user reference)
- Updated by (user reference)

### Quiz
- Title
- Description
- Duration (minutes)
- Difficulty (easy/medium/hard)
- Questions (array of question references)
- Total Marks
- Created by (user reference)
- Updated by (user reference)

## Setup and Installation

1. Clone the repository


Copy

Insert at cursor
markdown
git clone
cd mernQuiz/server


2. Install dependencies

Copy

Insert at cursor
npm install


3. Create a `.env` file with the following variables:

Copy

Insert at cursor
PORT=5000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key


4. Start the development server

Copy

Insert at cursor
npm run dev


5. For production

Copy

Insert at cursor
npm start


## API Security

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation
- Error handling

## Data Integrity

- Referential integrity between quizzes and questions
- Prevention of question deletion when referenced by quizzes
- Automatic calculation of total marks based on questions

## Error Handling

The API provides detailed error messages for:
- Validation errors
- Authentication errors
- Authorization errors
- Database errors
- Server errors

## Deployment

This application is configured for deployment on Vercel.

## License

[Prem](https://github.com/prem2230)
