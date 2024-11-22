const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController'); // Correct path to the controller

router.get('/count', voteController.count);
router.get('/candidate', voteController.list);

module.exports = router;
