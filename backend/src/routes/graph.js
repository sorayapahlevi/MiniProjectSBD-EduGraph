const express = require('express');
const router = express.Router();
const {
    getCareerPath,
    getAlumniByCareer,
    getMentorRecommendation,
    getGraphStats,
} = require('../controllers/graphController');

router.get('/career-path/:position', getCareerPath);
router.get('/alumni/:position', getAlumniByCareer);
router.get('/mentor/:position', getMentorRecommendation);
router.get('/stats', getGraphStats);

module.exports = router;