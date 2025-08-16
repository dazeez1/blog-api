# Blog API

A feature-rich RESTful API for a modern blogging platform with authentication, content management, and engagement features.

## Description

The Blog API powers blogging platforms with comprehensive content management capabilities. It supports rich text posts, user engagement features, and secure authentication for a complete blogging experience.

## Features

### Core Blogging Features

- ✅ Create, read, update, and delete blog posts
- ✅ Rich text content with tags
- ✅ Post pagination and filtering
- ✅ Post view counting
- ✅ Draft and published post states

### User Engagement

- ✅ Comments system with CRUD operations
- ✅ Comment pagination
- ✅ User authorization for content management
- ✅ Soft delete for comments

### Technical Features

- ✅ JWT authentication with secure token management
- ✅ Role-based access control (user/admin)
- ✅ Full-text search in posts
- ✅ Advanced pagination and filtering
- ✅ Input sanitization to prevent XSS attacks
- ✅ Rate limiting and security headers
- ✅ Comprehensive error handling

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

### Post Endpoints

| Method | Endpoint              | Description                          | Access  |
| ------ | --------------------- | ------------------------------------ | ------- |
| POST   | `/api/posts`          | Create a new post                    | Private |
| GET    | `/api/posts`          | Get all posts with pagination/filter | Public  |
| GET    | `/api/posts/my-posts` | Get current user's posts             | Private |
| GET    | `/api/posts/:id`      | Get a specific post                  | Public  |
| PUT    | `/api/posts/:id`      | Update a post (owner/admin only)     | Private |
| DELETE | `/api/posts/:id`      | Delete a post (owner/admin only)     | Private |

### Comment Endpoints

| Method | Endpoint                               | Description                         | Access  |
| ------ | -------------------------------------- | ----------------------------------- | ------- |
| POST   | `/api/comments/posts/:postId/comments` | Add comment to a post               | Private |
| GET    | `/api/comments/posts/:postId/comments` | Get comments for a post             | Public  |
| GET    | `/api/comments/my-comments`            | Get current user's comments         | Private |
| PUT    | `/api/comments/:id`                    | Update a comment (owner only)       | Private |
| DELETE | `/api/comments/:id`                    | Delete a comment (owner/admin only) | Private |

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

### Create a Post

**Request:**

```bash
POST /api/posts
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "My First Blog Post",
  "content": "This is the content of my first blog post. It contains at least 10 characters.",
  "tags": ["blog", "first-post", "tutorial"]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "post": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "title": "My First Blog Post",
      "content": "This is the content of my first blog post. It contains at least 10 characters.",
      "tags": ["blog", "first-post", "tutorial"],
      "author": {
        "id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "viewCount": 0,
      "isPublished": true,
      "createdAt": "2023-09-06T10:30:00.000Z",
      "updatedAt": "2023-09-06T10:30:00.000Z"
    }
  }
}
```

### Get Posts with Pagination and Filtering

**Request:**

```bash
GET /api/posts?page=1&limit=5&tags=blog&search=first&sortBy=createdAt&sortOrder=desc
```

**Response:**

```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "title": "My First Blog Post",
        "content": "This is the content of my first blog post...",
        "tags": ["blog", "first-post", "tutorial"],
        "author": {
          "id": "64f8a1b2c3d4e5f6a7b8c9d0",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "viewCount": 5,
        "isPublished": true,
        "createdAt": "2023-09-06T10:30:00.000Z",
        "updatedAt": "2023-09-06T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "itemsPerPage": 5,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

### Add a Comment

**Request:**

```bash
POST /api/comments/posts/64f8a1b2c3d4e5f6a7b8c9d1/comments
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "content": "Great post! Thanks for sharing."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "comment": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "content": "Great post! Thanks for sharing.",
      "author": {
        "id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "post": "64f8a1b2c3d4e5f6a7b8c9d1",
      "isActive": true,
      "createdAt": "2023-09-06T10:35:00.000Z",
      "updatedAt": "2023-09-06T10:35:00.000Z"
    }
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
- **Security**: Helmet, CORS, Rate limiting, Input sanitization
- **Testing**: Jest, Supertest

## Query Parameters for Posts

### Pagination

- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page

### Filtering

- `author` - Filter by author name or email
- `tags` - Filter by tags (comma-separated)
- `search` - Full-text search in title and content

### Sorting

- `sortBy` (default: "createdAt") - Sort field (title, createdAt, viewCount)
- `sortOrder` (default: "desc") - Sort order (asc, desc)

### Example Queries

```
GET /api/posts?page=1&limit=5&tags=blog,tutorial&search=javascript&sortBy=createdAt&sortOrder=desc
GET /api/posts?author=john&page=2&limit=20
GET /api/posts?tags=react&sortBy=viewCount&sortOrder=desc
```

## Project Structure

```
blog-api/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── userController.js    # User authentication logic
│   ├── postController.js    # Post CRUD operations
│   └── commentController.js # Comment CRUD operations
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── validate.js          # Input validation & sanitization
├── models/
│   ├── User.js              # User data model
│   ├── Post.js              # Post data model
│   └── Comment.js           # Comment data model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── posts.js             # Post routes
│   └── comments.js          # Comment routes
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
