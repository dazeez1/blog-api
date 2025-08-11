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

````bash
git clone https://github.com/yourusername/blog-api.git
cd blog-api

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm (v8 or higher)


2. Install dependencies:

   ```bash
   npm install
````

3. Create a `.env` file in the root directory:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/blogdb
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRES_IN=7d
   CLOUDINARY_URL=cloudinary://key:secret@cloudname  # For image uploads
   RATE_LIMIT_WINDOW=15
   RATE_LIMIT_MAX=100
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5000`

## Technologies Used

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **Receipt storage**: Cloudinary
- **Testing**: Jest, Socket.IO Client for testing

## Author

**Name**

- Name: Azeez Damilare Gbenga
