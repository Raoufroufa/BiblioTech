const express = require("express");
const router = express.Router();
const control = require('../controllers/applicant');
const controlAdmin = require('../controllers/admin');
const checkDueDate = require('../middlewhare/middlewhares');
const checkAdmin = require('../middlewhare/checkAdmin')

// Creating a borrowing 
router.post('/borrowings', control.addBorrowing);

// Get a history for an applicant
router.get('/borrowings/history/:userId', control.history);

// make a renew of borrowing 
router.put('/borrowings/:borrowingId/renew', checkDueDate, control.renewBorrowing);


// get statistics 
router.get('/borrowings/stats', checkAdmin, controlAdmin.statics);



module.exports = router;