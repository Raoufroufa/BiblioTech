const mongoose = require ('mongoose');
const Schema = mongoose.Schema;


// create borrowing Schema & model 
const BorrowingSchema = new Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    },
    book_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'book'
    },
    borrowDate: {
      type: Date,
      required: true
    },
    returnDate: {
      type: Date,
      required: true
    },
    renewed: { 
      type: Boolean,
      default: false 
    }
});

const Borrowing = mongoose.model('borrowing', BorrowingSchema);

module.exports = Borrowing;