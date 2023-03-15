const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();


// functions

async function registeration (req, res) {
  try {
    const { name, email,  user_name, password, address, phone, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    // const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email,  user_name, password: hashedPassword, address, phone, role });

    await user.save();


    // Send notification email
    if(user.role == "applicant") {
      
      const transporter = nodemailer.createTransport({
        
        service: 'gmail',
        auth: {
          
          user: 'rfabrik7@gmail.com',
          pass: 'crfcwdtowhmogbqe'
        }
      });

      const mailOptions = {

        from: 'rfabrik7@gmail.com',
        to: user.email,
        subject: 'Successful registration !',
        text: 'Thank you for registering on our platform.'
      };

      await transporter.sendMail(mailOptions);

    };

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET , {expiresIn: "1h"});

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


async function logging (req, res)  {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});

    res.json({ message: 'Logged in successfully', token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
    registeration,
    logging,
};