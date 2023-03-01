const Book = require('../models/book');
const Borrowing = require('../models/borrowing');

// functions

async function getAllBooks (req, res) {
    try {
        await Book.find({}).then(result => {
                res.send(result)
            })
    }

    catch (err) {
        console.log(err)
    }
};

async function getBook (req, res) {
    try {
        const book = await Book.findById(req.params.id);
        res.send(book)
    }
    catch (err) {
        console.log(err)
    }
};

async function addBorrowing (req, res) {

    const book = req.body.book
    const K= req.body.borrowDate;
    const Month = K.getMonth();
    
    try {
        const nbr = await Borrowing.find({user: req.body.user}) 
        if (nbr.length<4) {

            const search = await Book.findById(book._id);
            if (search.copies > 0){
            search.copies -= 1;
            const new_borrowing = new Borrowing({
            user: req.body.user,
            book: req.body.book,
            borrowDate: req.body.borrowDate,
            returnDate: req.body.returnDate
            });

            await new_borrowing.save();
            const bookUpdated = await Book.findByIdAndUpdate( book._id, {$inc: {nbr_borrowing: 1}});
            res.send('Your book is available you can borrow a copy!');
            }
            else{
            res.send('Sorry, Your book is not available!')
            };
            
        } else {
            res.json("You depassed the number allowed")
        }   
    }
    catch (err) {
        console.log(err)
    }
};

module.exports = {
    getBook,
    getAllBooks,
    addBorrowing
};