const mongoose = require ('mongoose');
const Schema = mongoose.Schema;


// create category Schema & model 
const CategorySchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    num_books: {
      type: Number,
      required: true,
    }
});

const Category = mongoose.model('category', CategorySchema);

module.exports = Category;
