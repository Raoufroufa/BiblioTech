const express = require('express');
const router = express.Router();

const books = require('./books');
const categories = require('./categories');

router.use('/books', books);
router.use('/categories', categories);

module.exports = router;