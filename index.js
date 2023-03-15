
const express = require('express');
const apiRouter = require('./routes/api');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');




const authRouter = require('./routes/auth');
const authMiddleware = require('./middlewhare/authm');

// set up express app
const app = express();
mongoose.set('strictQuery', true);

app.use(bodyParser.urlencoded({ extended: true}));


app.use(bodyParser.json());


// listen for requests 
app.listen(3000, () => console.log('Server started'));

// // connect to mongodb
mongoose.connect('mongodb+srv://raouf:123456Raouf@cluster0.zwk8poe.mongodb.net/?retryWrites=true&w=majority', { serverSelectionTimeoutMS: 30000 }, () =>console.log('Connection has been made, now make fireworks...'));

app.use(express.json());

// initiallize routes 
app.use('/api', apiRouter);

// register auth routes
app.use('/auth', authRouter);

// use auth middleware for api routes
app.use('/api', authMiddleware, apiRouter);