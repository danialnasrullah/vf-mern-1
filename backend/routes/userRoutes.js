const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateJWT } = require('./auth');
const { body, validationResult } = require('express-validator');
const sendEmail = require('../utils/sendEmail');
// Create a new user (student or teacher)
router.post(
  '/api/users',
  [
    // Validation and sanitization
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['student', 'teacher']).withMessage('Role must be student or teacher')
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, email, password, role } = req.body;

      // Check for existing user
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create and save user with hashed password
      const user = new User({ name, email, password: hashedPassword, role });
      await user.save();

      // Exclude password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(201).json({ success: true, data: userResponse });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
); //////////


// User login
router.post(
  '/api/users/login',
  [
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Check for user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        '69f3b75e3ab0ad1c', 
        { expiresIn: '1h' }
      );

      // Exclude password from response
      const userResponse = user.toObject();
      delete userResponse.password;

      res.json({ success: true, token, user: userResponse });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// Get all users
router.get('/api/users', authenticateJWT, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/users/test-email
// @desc    Sends a test email
// @access  Public (for testing purposes)
router.post('/api/users/test-email', async (req, res) => {
  // The email address to send to will be in the request body
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide an email address' });
  }

  try {
    await sendEmail({
      email: email,
      subject: 'Hello from Nodemailer!',
      message: 'This is a test email sent from the application.',
    });

    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});


module.exports = router;