const express = require("express");
const router = express.Router();
const controller = require('../controllers/admin');

// Creating a category 

router.post('/categories', controller.createCategory);

// Updating a category

router.patch('/categories/:id', controller.updatedCategory);

//Getting all categories
router.get('/categories', controller.getAllCategories);


//Get a category
router.get('/categories/:id', controller.getCategory);
 
// Delete a category
router.delete('/categories/:id', controller.deletedCategory);

// Updating a Book

router.patch('/books/:id', controller.updatedBook);

// Delete a Book
router.delete('/books/:id', controller.deletedBook);


module.exports = router;