const User = require('../models/user');
const isAuthenticated = require('../middlewhare/authm')

async function checkAdmin(req, res, next) {

  try {
    if (req.isAuthenticated && req.user.role === 'admin') {
      return res.status(403).json({ message: 'You are not authorized to access this resource.'});
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while checking user role.' });
  }

};

module.exports = checkAdmin;