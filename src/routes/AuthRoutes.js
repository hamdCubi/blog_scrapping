const express = require('express');
const router = express.Router();

const { validate } = require('../utils/Common');
const { body } = require('express-validator');

const { joinUser } = require('../controllers/AuthController');

router.post('/login', joinUser);

module.exports = router;