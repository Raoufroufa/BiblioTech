const express = require('express');
const router = express.Router();

const books = require('./books');
const categories = require('./categories');
const borrowings = require('./borrowings')

router.use('/books', books);
router.use('/categories', categories);
router.use('/borrowings', borrowings);

module.exports = router;