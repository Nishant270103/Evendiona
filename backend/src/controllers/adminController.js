const jwt = require('jsonwebtoken');

exports.adminLogin = (req, res) => {
  const { username, password } = req.body;

  // Check if credentials are provided
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  // Validate credentials from environment variables
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { admin: true, username },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1d' }
    );
    return res.json({
      success: true,
      message: 'Admin login successful',
      data: { token }
    });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }
};
