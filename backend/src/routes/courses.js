const express = require('express');
const router = express.Router();
const { getAllCourses, getCourseWithSkills, getCoursePrerequisiteChain } = require('../controllers/courseController');

router.get('/', getAllCourses);
router.get('/:code', getCourseWithSkills);
router.get('/:code/prerequisites', getCoursePrerequisiteChain);

module.exports = router;