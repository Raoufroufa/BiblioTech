const express = require('express');
const authControl = require('../controllers/auth');
require('dotenv').config();


const router = express.Router();

router.post('/register', authControl.registeration);




router.post('/logging', authControl.logging);


module.exports = router;



