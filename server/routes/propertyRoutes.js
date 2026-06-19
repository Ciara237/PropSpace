const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getAllProperties,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');

const router = express.Router();

router.get('/', getAllProperties);
router.get('/mine', verifyToken, getMyProperties);
router.post('/', verifyToken, createProperty);
router.put('/:id', verifyToken, updateProperty);
router.delete('/:id', verifyToken, deleteProperty);

module.exports = router;
