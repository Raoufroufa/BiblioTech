const mongoose = require ('mongoose');
const Schema = mongoose.Schema;


// create borrowing Schema & model 
const BorrowingSchema = new Schema({
    user_id: {
      type: String,
      required: true,
    },
    book_id: {
      type: String,
      required: true,
    },
    borrowDate: {
      type: Date,
      required: true
    },
    returnDate: {
      type: Date,
      required: true
    }
});

const Borrowing = mongoose.model('borrowing', BorrowingSchema);

module.exports = Borrowing;