const Post = require('../models/post');

const createPost = async (req, res) => {
  const { content, platform, scheduledAt } = req.body;
  // const createdBy = req.user._id;

  try {
    const post = await Post.create({ content, platform, scheduledAt });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create post' });
  }
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { content, platform, scheduledAt } = req.body;

  try {
    const post = await Post.findByIdAndUpdate(id, { content, platform, scheduledAt }, { new: true });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update post' });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    await Post.findByIdAndDelete(id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
};
