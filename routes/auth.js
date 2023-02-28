const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();
const authControl = require('../controllers/auth');


const router = express.Router();

router.post('/register', authControl.registeration);




router.post('/loggin', authControl.logging);


module.exports = router;



