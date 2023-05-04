const express = require('express');
const router = express.Router();

//controller imports
const { retrieveMessage } = require('../controllers/recipient.controller');

//controller imports
router.get('/:query', retrieveMessage);

module.exports = router;