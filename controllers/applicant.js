const Book = require('../models/book');
const Borrowing = require('../models/borrowing');
const Comment = require('../models/comment');
 
// functions

async function getAllBooks (req, res) {
    try {
        const result = await Book.find({});
        res.send(result);
    }

    catch (err) {
        console.log(err)
    }
};

async function getBook (req, res) {
     let book = null;
     const searchBy = req.query.searchBy;
     const value = req.query.value;

    try {
        switch(searchBy) {
            case '_id':
                book = await Book.findById(value);
                break;
            case 'author':
                book = await Book.find({author: value});
                break;
            case 'rate':
                book = await Book.find({rate: value});
                break;
            case 'id_category':
                book = await Book.findOne({id_category: value});
                break;    
            case 'nbr_borrowing':
                book = await Book.findOne({nbr_borrowing: value});
                break;    
            default:
                return res.status(400).json({message: 'Invalid searchBy parameter'});     
        }
        if (book) {
            res.status(200).json(book)
        } else {
            res.status(404).json({message: 'Book not found'})
        }
    }
    catch (err) {
        console.log(err)
        res.status(500).json({message: 'Internal server error'})
    }
};

async function addBorrowing (req, res) {


  const {user_id, book_id, borrowDate, returnDate} = req.body;

  if (!user_id || !book_id || !borrowDate || !returnDate) {

    return res.status(400).json({message: "Missing required property in request body"});
  }

  const month = new Date(borrowDate).getMonth();

    try {
      const borrowings = await Borrowing.find({ user_id });
      const count = borrowings.filter((b) => b.borrowDate.getMonth() === month).length; 

      if (count < 3) {
        const searchedBook = await Book.findById(book_id);
        if (searchedBook.copies > 0) {
          searchedBook.copies -= 1;
          const new_borrowing = new Borrowing ({
            user_id,
            book_id,
            borrowDate,
            returnDate
          });
          await new_borrowing.save();
          const bookUpdated = await Book.findByIdAndUpdate(book_id, { $inc: { nbr_borrowing: 1 } });
          res.json({ message: 'Your book is available, you can borrow a copy!' });
        } else {
          res.json({ message: 'Sorry, the book is not available!' });
        }
      } else {
        res.json({ message: 'You have exceeded the allowed number of borrowings for this month.' });
      }
    } catch (err) {
      
      console.log(err);
      res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
};


async function createComment (req, res) {

  try {
    const comment = new Comment({ 
        id_user: req.body.id_user, 
        text: req.body.text 
    });
    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }

};

async function getComments(req, res) {
  try {
    const comments = await Comment.find(req.params)
    // .populate('id_user', 'name')
    // .populate('parentCommentId', 'text');
    // console.log(comments);
    res.json(comments);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


async function updateComment(req, res) {
  try {
    const comment = await Comment.findById(req.params.id);

    // Check if comment exists
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Update the comment with new data
    comment.text = req.body.text;
    const updatedComment = await comment.save();

    res.json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

async function deleteComment (req, res) {
  try {
    const comment = await Comment.findById(req.params.id);

    // Check if comment exists
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Remove the comment's sub-comments from the database
    await Comment.deleteMany({ parentCommentId: comment._id });

    // Remove the comment from the database
    await comment.remove();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

async function createResponse(req, res){

  try {
    const parentComment = await Comment.findById(req.params.id);

    // Check if parent comment exists
    if (!parentComment) {
      return res.status(404).json({ message: 'Parent comment not found' });
    }

    // Create a new reply comment
    const replyComment = new Comment({
      id_book: parentComment.id_book,
      id_user: req.body.id_user,
      text: req.body.text,
      parentCommentId: parentComment._id
    });

    // Save the new reply comment to the database
    const newReply = await replyComment.save();

    res.json(newReply);
  }  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

async function getRespones(req, res) {
  try {
    const childComments = await Comment.find({ parentComment: req.params.id }).populate('id_user', 'name');

    res.json(childComments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}

async function updateResponse(req, res) {
  try {
    const { text } = req.body;
    const { parentId, childId } = req.params;

    const comment = await Comment.findOneAndUpdate(
      { _id: childId, parentCommentId: parentId },
      { text },
      { new: true }
    ).populate('id_user');

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

async function deleteResponse (req, res) {

    const { parentId, childId } = req.params;

    try {
        
        // Check if parent comment exists
        const parentComment = await Comment.findById(parentId);
        if (!parentComment) {
            
            return res.status(404).json({ message: 'Parent comment not found!' });
        }

        // Check if the answer exists
        const childComment = await Comment.findById(childId);
        if (!childComment) {
            
            return res.status(404).json({ message: 'Child comment not found!'});
        }

        // Check if the reply belongs to the parent comment
        if (childComment.parentComment !== childId) {
            
            return res.status(400).json({ message: 'Child comment not matched a specific parent comment!' });
        }

        // Delete answer
        await Comment.findByIdAndDelete(childId);

        res.json({ message: 'Child comment is deleted !' });
    } catch (error) {
        
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

async function history(req, res) {
  const userId = req.params.userId;
  try {
    const borrowingHistory = await Borrowing.find({ user_id: userId })
    .populate('book_id', 'title borrowDate returnDate');
    res.status(200).json(borrowingHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


async function renewBorrowing(req, res) {
  try {
    // Find book loan by its ID
    const borrowing = await Borrowing.findById(req.params.borrowingId);

    // Check if the book loan is already renewed
    if (borrowing.renewed) {
      return res.status(400).json({ message: "The book loan has already been renewed." });
    }

    // Renew book loan
    borrowing.returnDate.setDate(borrowing.returnDate.getDate() + 15); // Add 15 days to date
    borrowing.renewed = true;
    await borrowing.save();

    // Resend response with updated information
    res.json(borrowing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error'});
  }
}

module.exports = {
    getBook,
    getAllBooks,
    addBorrowing,
    createComment,
    getComments,
    updateComment,
    deleteComment,
    createResponse,
    getRespones,
    updateResponse,
    deleteResponse,
    history,
    renewBorrowing
};