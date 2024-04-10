const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/Auth.controller');

//Login user
router.post('/login', AuthController.loginUser);

router.post('/googlelogin', AuthController.googleloginUser);

// forgot password
router.post('/forgot-password', AuthController.forgotPassword);

// reset password
router.get('/reset-password/:id/:token', AuthController.getResetPassword);

router.post('/reset-password/:id/:token',AuthController.postResetPassword);

module.exports = router;