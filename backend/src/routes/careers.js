const express = require('express');
const router = express.Router();
const { getAllCareers, getCareerWithFullPath, createCareer } = require('../controllers/careerController');

router.get('/', getAllCareers);
router.get('/:position', getCareerWithFullPath); // Menggantikan kebutuhan endpoint graph terpisah
router.post('/', createCareer);

module.exports = router;