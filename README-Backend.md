# SIH Civic Reporting Backend Setup

## Quick Start

1. **Install Node.js** (if not already installed):
   - Download from https://nodejs.org/
   - Install the LTS version

2. **Start the backend server**:
   - Double-click `start-backend.bat` 
   - OR run manually:
     ```bash
     npm install
     npm start
     ```

3. **Test the connection**:
   - Open `report-issue.html` in your browser
   - Click "Test Backend Connection" button
   - You should see "Backend connected!" message

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/posts` - Get all issues
- `POST /api/posts` - Create new issue
- `GET /api/posts/:id` - Get specific issue
- `PUT /api/posts/:id/status` - Update issue status
- `GET /api/posts/stats/summary` - Get issue statistics

## Server Configuration

- **Port**: 5000
- **URL**: http://localhost:5000
- **CORS**: Enabled for all origins
- **Authentication**: JWT tokens

## Features

- ✅ User authentication (signup/login)
- ✅ Issue creation and management
- ✅ Status updates
- ✅ Statistics tracking
- ✅ CORS enabled for frontend
- ✅ JWT token authentication

## Troubleshooting

1. **Port 5000 already in use**:
   - Change PORT in `server.js` line 7
   - Update `config.js` with new port

2. **Connection failed**:
   - Make sure Node.js is installed
   - Check if server is running
   - Verify no firewall blocking port 5000

3. **Dependencies error**:
   - Delete `node_modules` folder
   - Run `npm install` again