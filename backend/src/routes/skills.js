const express = require('express');
const router = express.Router();
const { getAllSkills, getMostValuableSkills, createSkill } = require('../controllers/skillController');

router.get('/', getAllSkills);
router.get('/top', getMostValuableSkills); // Endpoint khusus: skill paling berharga
router.post('/', createSkill);

module.exports = router;