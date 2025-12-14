const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Issue-specific fields
  issueType: { type: String, enum: ['Illegal Dumping/Trash', 'Graffiti', 'Pothole', 'Street Light Outage', 'Other'], default: 'Other' },
  location: { type: String, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'resolved'], default: 'pending' },
  reporterName: { type: String, required: true },
  reporterEmail: { type: String },
  reporterPhone: { type: String },
  assignedTo: { type: String, default: null },
  comments: [{
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'in-progress', 'resolved'] },
    comment: { type: String, required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);