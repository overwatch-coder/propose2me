const express = require("express");
const router = express.Router();

//controller imports
const { retrieveMessage } = require("../controllers/recipient.controller");

//controller imports
router.post("/", retrieveMessage);

module.exports = router;
