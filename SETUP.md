# SIH Project 2025 - Setup Instructions

## Backend and Frontend Integration

This project now includes full backend integration for the report issues and view issues functionality.

## Prerequisites

1. **Node.js** (v14 or higher) - Download from [nodejs.org](https://nodejs.org/)
2. **MongoDB** - Either local installation or MongoDB Atlas account

## Setup Steps

### 1. Backend Setup

1. Navigate to the `backend` folder
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` folder with:
   ```
   MONGODB_URI=mongodb://localhost:27017/sih-project
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   
   Or use the provided batch file:
   ```bash
   start-backend.bat
   ```

### 2. Frontend Setup

1. Open any of the HTML files in a web browser
2. The frontend will automatically connect to the backend at `http://localhost:5000`

## Features

### Report Issues Page (`report-issue.html`)
- ✅ Connected to backend API
- ✅ Auto-user registration for issue reporting
- ✅ Form validation and error handling
- ✅ Loading states and user feedback

### View Issues Page (`view-issues.html`)
- ✅ Loads issues from backend database
- ✅ Real-time filtering and sorting
- ✅ Detailed issue view with timeline
- ✅ Statistics dashboard

## API Endpoints

- `GET /api/posts` - Get all issues with optional filters
- `POST /api/posts` - Create new issue
- `GET /api/posts/:id` - Get specific issue
- `PUT /api/posts/:id/status` - Update issue status (admin)
- `GET /api/posts/stats/summary` - Get issue statistics

## Configuration

Edit `config.js` to change:
- API base URL
- Feature flags
- Environment settings

## Troubleshooting

### Backend Connection Issues
1. Make sure MongoDB is running
2. Check if port 5000 is available
3. Verify the `.env` file configuration

### Frontend Issues
1. Check browser console for errors
2. Ensure all script files are loaded
3. Verify API base URL in `config.js`

## File Structure

```
SIH-Project-2025/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── report-issue.html
├── view-issues.html
├── api.js
├── config.js
├── loading-styles.css
└── start-backend.bat
```

## Next Steps

1. Test the complete flow: Report Issue → View Issues
2. Add admin functionality for issue management
3. Implement file upload for issue photos
4. Add real-time notifications

## Support

If you encounter any issues, check:
1. Browser console for JavaScript errors
2. Backend server logs
3. Network tab in browser dev tools