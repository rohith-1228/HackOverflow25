const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
let users = [];
let posts = [];
let nextId = 1;

// Auth middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = {
            id: users.length + 1,
            username,
            email,
            password: hashedPassword
        };
        users.push(user);

        // Generate token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        
        res.json({ token, user: { id: user.id, username, email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
        
        res.json({ token, user: { id: user.id, username: user.username, email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Posts/Issues routes
app.get('/api/posts', (req, res) => {
    res.json(posts);
});

app.post('/api/posts', authenticateToken, (req, res) => {
    try {
        const { title, content, issueType, location, reporterName, reporterPhone } = req.body;
        
        const post = {
            _id: nextId++,
            title,
            content,
            issueType,
            location,
            reporterName,
            reporterPhone,
            status: 'pending',
            createdAt: new Date().toISOString(),
            userId: req.user.id
        };
        
        posts.push(post);
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/posts/:id', (req, res) => {
    const post = posts.find(p => p._id == req.params.id);
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
});

app.put('/api/posts/:id/status', authenticateToken, (req, res) => {
    try {
        const { status, comment, assignedTo } = req.body;
        const post = posts.find(p => p._id == req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        post.status = status;
        post.comment = comment;
        post.assignedTo = assignedTo;
        post.updatedAt = new Date().toISOString();
        
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/posts/stats/summary', (req, res) => {
    const stats = {
        total: posts.length,
        pending: posts.filter(p => p.status === 'pending').length,
        inProgress: posts.filter(p => p.status === 'in-progress').length,
        resolved: posts.filter(p => p.status === 'resolved').length
    };
    res.json(stats);
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
});