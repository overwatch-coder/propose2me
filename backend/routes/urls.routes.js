const express = require('express');
const { getUserUrls, saveUserUrls } = require('../controllers/urls.controller');
const { authenticateUser } = require('../middleware/userAuth');

const router = express.Router();

router.use(authenticateUser);

router.get('/', getUserUrls);
router.post('/', saveUserUrls);

module.exports = router;