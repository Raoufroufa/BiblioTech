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


module.exports = router;