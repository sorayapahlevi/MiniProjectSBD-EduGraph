const express = require('express');
const router = express.Router();
const { getMostConnected, getPopularCareers } = require('../controllers/analyticsController');

router.get('/most-connected', getMostConnected);
router.get('/popular-careers', getPopularCareers);

module.exports = router;