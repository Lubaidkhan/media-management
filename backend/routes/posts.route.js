const express = require('express');
// const passport = require('passport');
const jwt = require('jsonwebtoken');
const PostController = require('../controllers/postController');
const router = express.Router();

// const requireAuth = (req, res, next) => {
//   if (!req.user) {
//     return res.status(401).json({ message: 'You must be logged in to perform this action' });
//   }
//   next();
// };

// router.post('/login/facebook', passport.authenticate('facebook-token'), (req, res) => {
//   const token = jwt.sign({ userId: req.user.id }, 'your-jwt-secret');
//   res.json({ token });
// });

// router.post('/posts', requireAuth, PostController.createPost);
router.post('/newpost',  PostController.createPost);
router.put('/posts/:id',  PostController.updatePost);
router.delete('/posts/:id',  PostController.deletePost);

module.exports = router;
