const express = require('express');
const router = express.Router();
const { getCareerPath, getAlumniByCareer, getMentorRecommendation, getGraphStats, getEntireGraph, getTopicNeighborhood } = require('../controllers/graphController');

router.get('/', getEntireGraph);
router.get('/career-path/:position', getCareerPath);
router.get('/alumni/:position', getAlumniByCareer);
router.get('/mentor/:position', getMentorRecommendation);
router.get('/stats', getGraphStats);
router.get('/topic/:topic', getTopicNeighborhood);

module.exports = router;