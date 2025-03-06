const User = require('../models/User');

exports.authMiddleware = async (req, res, next) => {
  try {
    const userData = req.headers.authorization;
    if (!userData) {
      return res.status(401).json({ error: 'No user data provided' });
    }

    const user = await User.findById(userData);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};
