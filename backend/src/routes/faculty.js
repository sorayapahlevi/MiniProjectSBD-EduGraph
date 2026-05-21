const express = require('express');
const router = express.Router();
const { getAllFaculty, getFacultyWithNetwork } = require('../controllers/facultyController');

router.get('/', getAllFaculty);
router.get('/:name', getFacultyWithNetwork);

module.exports = router;