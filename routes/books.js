const express = require("express");
const router = express.Router();
const controller = require('../controllers/admin');
const control = require('../controllers/applicant');

// Add a book
router.post('/books', controller.addBook);


// Update a book 
router.patch('/books/:id', controller.updatedBook);


// Delete a book 
router.delete('/books/:id', controller.deletedBook);

//Getting all books
router.get('/books', control.getAllBooks);


//Get a book
router.get('/books/search', control.getBook);

// create a new comment
router.post('/books/:id/comments', control.createComment);


// get all comments for a book
router.get('/books/:id', control.getComments);

module.exports = router;