const mongoose = require ('mongoose');
const Schema = mongoose.Schema;


// create comment Schema & model 
const CommentSchema = new Schema({
    id_book: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'book'
    },
    id_user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    },
    text: {
        type: String,
        required: true
    },
    parentCommentId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'comment',
        default: null
    },
    createdAt: {
        type: Date, 
        default: Date.now 
    }
});

const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;