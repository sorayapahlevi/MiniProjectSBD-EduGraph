const express = require('express');
const router = express.Router();
const { getAllAlumni, getAlumniByName, getAlumniLearningPath, createAlumni, updateAlumniProfile } = require('../controllers/alumniController');

router.get('/', getAllAlumni);
router.post('/update', updateAlumniProfile);
router.get('/:name', getAlumniByName);
router.get('/:name/learning-path', getAlumniLearningPath);
router.post('/', createAlumni);

module.exports = router;