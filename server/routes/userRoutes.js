const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { getProfile, updateProfile, updatePassword } = require('../controllers/userController');

const router = express.Router();

router.get('/me', verifyToken, getProfile);
router.put('/me/password', verifyToken, updatePassword);
router.put('/me', verifyToken, updateProfile);

module.exports = router;
