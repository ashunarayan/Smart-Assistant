const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// POST /ai - main entry for user prompts
router.post('/', aiController.handlePrompt);

module.exports = router;
