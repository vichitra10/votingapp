const express = require('express');
const router = express.Router();
const User = require('../models/User');
const userController = require('../controllers/userController');
const authenticateJWT = require('../middleware/auth');

// Post route to add a user

router.post('/signup', userController.signUp );
router.post('/signin',  userController.signIn );
router.post('/voteto/:candidateId', authenticateJWT, userController.voteTo);
router.put('/changepassword',  authenticateJWT, userController.changePassword);
router.get('/logout', authenticateJWT, userController.logout);


module.exports = router; // Export the router