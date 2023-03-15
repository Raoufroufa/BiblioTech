const express = require('express');
const router = express.Router();

const books = require('./books');
const categories = require('./categories');
const borrowings = require('./borrowings');
const applicants = require('./applicants');
const comments = require('./comments');



router.use('/books', books);
router.use('/categories', categories);
router.use('/borrowings', borrowings);
router.use('/applicants', applicants);
router.use('/comments', comments);

module.exports = router;