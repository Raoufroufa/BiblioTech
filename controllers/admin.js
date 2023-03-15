const Book = require('../models/book');
const Category = require('../models/category');
const Borrowing = require('../models/borrowing');
const User = require('../models/user');
const nodemailer = require('nodemailer');

// functions

async function getAllApplicants (req, res) {
    try {
        const result = await User.find({role: "applicant"});
        res.send(result);
    }

    catch (err) {
        console.log(err)
    }
};


async function createCategory(req, res){
    let category = new Category({
        name: req.body.name,
        num_books: req.body.num_books,
    });
    try {
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    }  catch (err) {
        res.status(400).json({ message: err.message})
    }
};

async function getCategory (req, res) {
    try {
        const category = await Category.findById(req.params.id);
        res.send(category);
    }
    catch (err) {
        console.log(err);
    }
};

async function updatedCategory(req, res){
    try {
        const categoryUpdated = await Category.findByIdAndUpdate(req.params.id, req.body);
        res.json(categoryUpdated);
    } catch (err) {
        res.status(400).json({ message: err.message});
    }; 
};

async function deletedCategory(req, res){
    try {
        const categoryDeleted = await Category.findByIdAndRemove(req.params.id); 
      if (categoryDeleted) {
        res.json({ message: 'Category deleted with success' }); 
      } else {
        res.status(404).json({ message: 'Category deleted'}); 
      }
    } catch (err) {
      res.status(500).json({ message: err.message }); 
    };
};

async function getAllCategories (req, res) {
    try {
        const result = await Category.find({});
        res.send(result);
    }

    catch (err) {
        console.log(err)
    }
};


async function  addBook (req, res) {

    const id_category = req.body.id_category

    try {
        const categoryExists = await Category.exists({ _id: id_category });
        if (!categoryExists) {
            
            throw new Error("Category does not exist");
        }

        const new_book = new Book({
            title: req.body.title,
            id_category: id_category,
            author: req.body.author,
            isbn: req.body.isbn,
            rate: req.body.rate,
            copies: req.body.copies,
            nbr_borrowing: req.body.nbr_borrowing,
        });

        const categoryUpdated = await Category.findByIdAndUpdate(
           id_category,
           {$inc: {num_books: 1}}, 
           {new: true}
        );
       
        await new_book.save();

        // Send notification email
        
        const transporter = nodemailer.createTransport({
            
            service: 'gmail',
            auth: {

                user: 'rfabrik7@gmail.com',
                pass: 'crfcwdtowhmogbqe'
            }
        });

        const subscribers = await User.find();
        const subscriberEmails = subscribers.map(subscriber => subscriber.email);
  
        const mailOptions = {
            
            from: 'rfabrik7@gmail.com',
            to: subscriberEmails,
            subject: 'New book added!',
            text: `A new book has been added: ${new_book.title} by ${new_book.author}.`
        };

        await transporter.sendMail(mailOptions);

        res.send(new_book);
    } catch (err) {
        console.log(err);
    }
};

async function updatedBook(req, res){
    try {
        const bookUpdated = await Book.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(bookUpdated);
    } catch (err) {
        res.status(400).json({ message: err.message});
    }; 
};

async function deletedBook(req, res){
    try {
        const bookDeleted = await Book.findByIdAndRemove(req.params.id); 
      if (bookDeleted) {
        res.json({ message: 'Book deleted with success' }); 
      } else {
        res.status(404).json({ message: 'Book deleted'}); 
      }
    } catch (err) {
      res.status(500).json({ message: err.message }); 
    };
};


async function statics(req, res) {

    try {

     // Count the total number of loans made
        const totalBorrowings = await Borrowing.countDocuments();

     // Find the most borrowed books
        const mostBorrowedBooks = await Borrowing.aggregate([
        
            { $group: { _id: '$book_id', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $lookup: { from: 'books', localField: '_id', foreignField: '_id', as: 'book' } },
            { $unwind: '$book' },
            { $project: { title: '$book.title', count: 1 } }
        ]);

     // Count the total number of registered readers
        const totalUsers = await User.countDocuments({ role: 'user' });

     // Return response with statistics
        res.json({ 
            message: 'the number of loans made,the most borrowed books top 10, and the number of readers are, in order:',
            totalBorrowings,
            mostBorrowedBooks, 
            totalUsers 
        });
    } catch (error) {
        
        console.error(error);
        res.status(500).json({ message: 'An error occurred while retrieving library statistics!' });
    }
};


module.exports = {
    getAllApplicants,
    createCategory,
    getCategory,
    updatedCategory,
    deletedCategory,
    getAllCategories,
    addBook,
    updatedBook,
    deletedBook,
    statics
};