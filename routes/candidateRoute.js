const express = require('express');
const router = express.Router();
const User = require('../models/Candidate');
const candidateController = require('../controllers/candidateController');
const authenticateJWT = require('../middleware/auth');

// Post route to add a user

router.post('/create', candidateController.create );

router.put('/update/:candidateid', candidateController.update );
router.delete('/delete/:candidateid', candidateController.deletedata );

// router.get('/votecount', candidateController.voteCount);


module.exports = router; // Export the router