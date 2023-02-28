const mongoose = require ('mongoose');
const Schema = mongoose.Schema;


// create borrowing Schema & model 
const BorrowingSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: "book",
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