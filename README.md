# Blog API

A feature-rich RESTful API for a modern blogging platform with authentication, content management, and engagement features.

## Description

The Blog API powers blogging platforms with comprehensive content management capabilities. It supports rich text posts, user engagement features, and secure authentication for a complete blogging experience.

## Features

### Core Blogging Features

- Create, read, update, and delete blog posts
- Rich text content with Markdown support
- Post categories and tags
- Featured images for posts
- Post scheduling and drafts

### User Engagement

- Comments with threading
- Post likes/dislikes
- Bookmarking functionality
- User following system
- Notification system

### Technical Features

- JWT authentication
- Role-based access control
- Full-text search
- Pagination and filtering
- Image upload and processing
- Rate limiting

## Installation & Usage

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/dazeez1/blog-api.git
cd blog-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/blogdb

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5000`

## API Endpoints

### Authentication Endpoints

| Method | Endpoint           | Description              | Access  |
| ------ | ------------------ | ------------------------ | ------- |
| POST   | `/api/auth/signup` | Register a new user      | Public  |
| POST   | `/api/auth/login`  | Login user               | Public  |
| GET    | `/api/auth/me`     | Get current user profile | Private |
| PUT    | `/api/auth/me`     | Update user profile      | Private |

### Health Check

| Method | Endpoint  | Description       |
| ------ | --------- | ----------------- |
| GET    | `/health` | API health status |

## Request/Response Examples

### User Registration

**Request:**

```bash
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### User Login

**Request:**

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get User Profile (Protected Route)

**Request:**

```bash
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2023-09-06T10:30:00.000Z"
    }
  }
}
```

## Technologies Used

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting
- **Testing**: Jest, Supertest

## Project Structure

```
blog-api/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   └── userController.js    # User authentication logic
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── validate.js          # Input validation middleware
├── models/
│   └── User.js              # User data model
├── routes/
│   └── auth.js              # Authentication routes
├── tests/                   # Test files
├── app.js                   # Express app configuration
├── server.js                # Server entry point
├── package.json             # Dependencies and scripts
└── README.md               # Project documentation
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## Author

**Azeez Damilare Gbenga**

- GitHub: [@dazeez1](https://github.com/dazeez1)
