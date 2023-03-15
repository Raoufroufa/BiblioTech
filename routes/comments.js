const express = require('express');
const router = express.Router();
const control = require('../controllers/applicant');
const checkCommentOwnership = require('../middlewhare/checkCommentOwnership');

// Updating a comment
router.patch('/comments/:id', checkCommentOwnership, control.updateComment);


// Delete a comment
router.delete('/comments/:id', checkCommentOwnership, control.deleteComment);


// Create a new reply to a specific comment
router.post('/comments/:parentId/child-comments',control.createResponse)


// get all replies to a specific comment
router.get('/comments/:parentId/child-comments',control.getRespones)


// Updating a response
router.patch('/comments/:parentId/child-comments/:childId', checkCommentOwnership, control.updateResponse);


// Delete a response
 router.delete('/comments/:parentId/child-comments/:childId', checkCommentOwnership, control.deleteResponse);


module.exports = router;