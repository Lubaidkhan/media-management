const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  platform: { type: String, required: true },
  // scheduledAt: { type: Date, required: true },
  scheduledAt: { type: String, required: true },
  // createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
    // required: true,
  },
  
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
