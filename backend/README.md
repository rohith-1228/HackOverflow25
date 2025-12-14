# SIH Backend Setup Instructions

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

## Setup Steps

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Update `.env` file with your MongoDB URI and JWT secret
   - For local MongoDB: `MONGODB_URI=mongodb://localhost:27017/sih-project`
   - For MongoDB Atlas: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sih-project`

4. **Start MongoDB (if using local installation):**
   ```bash
   mongod
   ```

5. **Run the server:**
   ```bash
   # Development mode (auto-restart on changes)
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Users (Protected)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Posts
- `GET /api/posts` - Get all posts (public)
- `GET /api/posts/:id` - Get post by ID (public)
- `POST /api/posts` - Create post (protected)
- `PUT /api/posts/:id` - Update post (protected, author only)
- `DELETE /api/posts/:id` - Delete post (protected, author only)

## Frontend Integration
Include the JWT token in Authorization header:
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

Server runs on http://localhost:5000