const express = require('express');
const router = express.Router();
const { getMonasteries, getMonasteryById } = require('../controllers/monasteryController');

router.get('/', getMonasteries);
router.get('/:id', getMonasteryById);

module.exports = router;
