const express = require('express');
const router = express.Router();
const { getAllAlumni, getAlumniByName, getAlumniLearningPath, createAlumni } = require('../controllers/alumniController');

router.get('/', getAllAlumni);
router.get('/:name', getAlumniByName);
router.get('/:name/learning-path', getAlumniLearningPath);
router.post('/', createAlumni); // Fitur tambahan untuk ekspansi sistem

module.exports = router;