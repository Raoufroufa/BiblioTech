const User = require('../models/user');

async function checkCommentOwnership(req, res, next) {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.id_user.toString() !== req.user._id) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = checkCommentOwnership;