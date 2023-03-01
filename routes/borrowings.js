const express = require("express");
const router = express.Router();
const control = require('../controllers/applicant');

// Creating a borrowing 
router.post('/borrowings', control.addBorrowing);

module.exports = router;