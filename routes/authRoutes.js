const express = require('express');
const { googleLogin } = require('../controllers/authController');
const router = express.Router();

router.post('/login', googleLogin);

module.exports = router;
