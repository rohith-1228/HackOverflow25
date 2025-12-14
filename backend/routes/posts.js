const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all issues/posts
router.get('/', async (req, res) => {
  try {
    const { status, location, dateFilter, sortBy } = req.query;
    let query = {};
    
    // Apply filters
    if (status) query.status = status;
    if (location) query.location = { $regex: location, $options: 'i' };
    
    let posts = Post.find(query).populate('author', 'username email');
    
    // Apply sorting
    if (sortBy === 'oldest') {
      posts = posts.sort({ createdAt: 1 });
    } else if (sortBy === 'status') {
      posts = posts.sort({ status: 1, createdAt: -1 });
    } else {
      posts = posts.sort({ createdAt: -1 }); // newest first by default
    }
    
    const result = await posts;
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get issue by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username email');
    if (!post) return res.status(404).json({ message: 'Issue not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new issue
router.post('/', auth, async (req, res) => {
  try {
    const { 
      title, 
      content, 
      issueType, 
      location, 
      reporterName, 
      reporterEmail, 
      reporterPhone 
    } = req.body;
    
    const post = new Post({ 
      title, 
      content, 
      author: req.user._id,
      issueType: issueType || 'Other',
      location,
      reporterName,
      reporterEmail,
      reporterPhone,
      status: 'pending',
      comments: [{
        status: 'pending',
        comment: 'Issue reported by citizen'
      }]
    });
    
    await post.save();
    await post.populate('author', 'username email');
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update issue status (for admin)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, comment, assignedTo } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) return res.status(404).json({ message: 'Issue not found' });
    
    // Update status and assigned department
    post.status = status;
    if (assignedTo) post.assignedTo = assignedTo;
    
    // Add comment to timeline
    post.comments.push({
      status,
      comment: comment || `Status updated to ${status}`
    });
    
    await post.save();
    await post.populate('author', 'username email');
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update issue
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, issueType, location } = req.body;
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      { title, content, issueType, location },
      { new: true }
    ).populate('author', 'username email');
    if (!post) return res.status(404).json({ message: 'Issue not found or unauthorized' });
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete issue
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user._id });
    if (!post) return res.status(404).json({ message: 'Issue not found or unauthorized' });
    res.json({ message: 'Issue deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await Post.countDocuments();
    const pending = await Post.countDocuments({ status: 'pending' });
    const inProgress = await Post.countDocuments({ status: 'in-progress' });
    const resolved = await Post.countDocuments({ status: 'resolved' });
    
    res.json({
      total,
      pending,
      inProgress,
      resolved
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;