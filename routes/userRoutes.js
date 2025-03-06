const express = require('express');
const { getProfile, updateProfile, getChainMembers } = require('../controllers/userController');
const router = express.Router();

router.get('/profile', getProfile);
router.put('/update', updateProfile);
router.get('/chain-members', getChainMembers);

module.exports = router;
