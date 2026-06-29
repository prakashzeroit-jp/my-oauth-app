const jwt = require('jsonwebtoken');

exports.googleAuthSuccess = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }

  const token = jwt.sign(
    { id: req.user._id, email: req.user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.status(200).json({
    success: true,
    message: 'Authentication successful',
    token: `Bearer ${token}`,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar
    }
  });
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ success: false, message: 'Logout failed' });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  });
};



















