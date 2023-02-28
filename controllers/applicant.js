const Book = require('../models/book');

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

module.exports = {
    getBook,
    getAllBooks,
};