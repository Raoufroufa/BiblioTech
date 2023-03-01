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
    const book =[];
    
    try {
        switch(req.query) {
            case Book._id:
                book = await Book.findById(Book._id);
                break;
            case Book.author:
                book = await Book.findOne({author: Book.author});
                break;
            case Book.rate:
                book = await Book.findOne({rate: Book.rate});
                break;
            case Book.category:
                book = await Book.findOne({category: Book.category});
                break;    
            case Book.nbr_borrowing:
                book = await Book.findOne({nbr_borrowing: Book.nbr_borrowing});
                break;    
            default:
                res.json(`Sorry, not found!!`);    
        }
        res.status(200).json(book)
    }
    catch (err) {
        console.log(err)
    }
};

async function addBorrowing (req, res) {

    const book = req.body.book
    const month = new Date(req.body.borrowDate).getMonth()
    try {
        const nbr = await Borrowing.find({user: req.body.user}) 
        const count= 0;
        for (let i=0; i<nbr.length; i++) {
            if (nbr[i].borrowDate.getMonth() = month) {
                count += 1;
            };
            return count;
        }
        if (count < 3) {
            const search = await Book.findById(book._id);
            console.log(search)
            if (search[0].copies > 0){
                search[0].copies -= 1;
                const new_borrowing = new Borrowing({
                    user: req.body.user,
                    book: req.body.book,
                    borrowDate: req.body.borrowDate,
                    returnDate: req.body.returnDate
                });

                await new_borrowing.save();
                const bookUpdated = await Book.findByIdAndUpdate( book._id, {$inc: {nbr_borrowing: 1}});
                res.send('Your book is available you can borrow a copy!');
            } else {
                res.send('Sorry, Your book is not available!');
            };
            
        } else {
            res.json("You depassed the number allowed");
        }   
    }
    catch (err) {
        console.log(err);
    };
};

module.exports = {
    getBook,
    getAllBooks,
    addBorrowing
};