const Borrowing = require('../models/borrowing');


// Middleware to check if the book loan is overdue and apply a suspension penalty if necessary
async function  checkReturnDate (req, res, next) {

  try {
    // Find book loan by its ID
    const borrowing = await Borrowing.findById(req.params.borrowingId);

    // Check if book borrowing is overdue
    const today = new Date();
    if (today > borrowing.returnDate) {

      // Apply a 10-day suspension penalty
      const newDate= new Date(today.setDate(today.getDate() + 10));

      return res.status(200).json({
      message: "Borrowing renewed with penalty applied, you are suspended for 10 days. You'll be able to borrow on:",
      newDate
    });
    };

    next();
   } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error while checking loan return date' });
   };
};

module.exports = checkReturnDate;