const mongoose = require ('mongoose');
const Schema = mongoose.Schema;


// create book Schema & model 
const BookSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
     id_category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'category'
    },
    author: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    copies: {
      type: Number,
      required: true,
    },
    nbr_borrowing:{
      type:Number,
      default:0
    }
});

const Book = mongoose.model('book', BookSchema);

module.exports = Book;
