const express = require("express");
const router = express.Router();
const controlAdmin = require('../controllers/admin');
const checkAdmin = require('../middlewhare/checkAdmin');

//Getting all applicants
router.get('/applicants', checkAdmin, controlAdmin.getAllApplicants);


module.exports = router;