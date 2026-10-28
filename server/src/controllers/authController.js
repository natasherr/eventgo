const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: '24h' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { full_name, email, phone_number, password } = req.body;

    // 1. Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Create user
    const user = await User.create({
      full_name,
      email,
      phone_number,
      password_hash,
      role: 'user' // Default role
    });

    // 4. Generate token and respond
    const token = generateToken(user);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.user_id, name: user.full_name, role: user.role }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check for user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Check if active
    if (!user.is_active) {
      return res.status(403).json({ message: 'Account is disabled. Contact admin.' });
    }

    // 3. Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 4. Update last login
    user.last_login = new Date();
    await user.save();

    // 5. Generate token and respond
    const token = generateToken(user);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.user_id, name: user.full_name, role: user.role }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
