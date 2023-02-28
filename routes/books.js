const express = require("express");
const router = express.Router();
const controller = require('../controllers/admin');
const control = require('../controllers/applicant');

//Getting all books
router.get('/books', control.getAllBooks);


//Get a book
router.get('/books/:id', control.getBook);


module.exports = router;