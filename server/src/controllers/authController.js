const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, AuthToken } = require('../models');
const { logAction } = require('../utils/auditLogger');
const { sendEmail } = require('../utils/emailSender');
const { resetPasswordTemplate, twoFactorCodeTemplate } = require('../utils/emailTemplates');

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

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await User.create({
      full_name,
      email,
      phone_number,
      password_hash,
      role: 'user'
    });

    const token = generateToken(user);

    await logAction(user.user_id, 'USER_REGISTER', 'User', user.user_id, 'New user registered', req.ip);

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

// @desc    Authenticate user & generate 2FA for admin
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (!user.is_active) return res.status(403).json({ message: 'Account is disabled. Contact admin.' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    user.last_login = new Date();
    await user.save();

    await logAction(user.user_id, 'USER_LOGIN', 'User', user.user_id, 'User logged in successfully', req.ip);

    // If user is ADMIN, trigger 2FA
    if (user.role === 'admin') {
      const crypto = require('crypto');
      
      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Hash the OTP before saving to DB
      const salt = await bcrypt.genSalt(10);
      const token_hash = await bcrypt.hash(otp, salt);
      
      // Delete any existing OTPs for this user
      await AuthToken.destroy({ where: { user_id: user.user_id, purpose: 'two_fa_otp' } });

      // Save new OTP to DB (expires in 5 minutes)
      await AuthToken.create({
        user_id: user.user_id,
        purpose: 'two_fa_otp',
        token_hash: token_hash,
        expires_at: new Date(Date.now() + 5 * 60000)
      });

      // Send the 2FA code via email
      const emailHtml = twoFactorCodeTemplate(user.full_name, otp);
      await sendEmail(user.email, 'EventGo Admin - Your 2FA Security Code', emailHtml);

      return res.status(200).json({ 
        message: '2FA required. Check your email for the code.', 
        requires2FA: true,
        email: user.email
      });
    }

    // Normal user login (no 2FA)
    const token = generateToken(user);
    res.status(200).json({ 
      message: 'Login Successful!', 
      token, 
      user: { id: user.user_id, name: user.full_name, role: user.role } 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Verify Admin 2FA code and issue final token
// @route   POST /api/auth/verify-2fa
exports.verify2FA = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Find the latest OTP for this user
    const authToken = await AuthToken.findOne({
      where: { user_id: user.user_id, purpose: 'two_fa_otp' },
      order: [['created_at', 'DESC']]
    });

    if (!authToken) return res.status(400).json({ message: 'No active 2FA code found' });
    
    // Check if expired
    if (new Date() > authToken.expires_at) {
      return res.status(400).json({ message: 'Code expired. Please login again.' });
    }

    // Check if the code matches the hash
    const isValid = await bcrypt.compare(otp, authToken.token_hash);
    if (!isValid) return res.status(401).json({ message: 'Invalid code' });

    // Mark as used
    authToken.used_at = new Date();
    await authToken.save();

    await logAction(user.user_id, 'USER_LOGIN_2FA', 'User', user.user_id, 'Admin passed 2FA verification', req.ip);

    // Generate the real JWT Token now that 2FA is passed
    const token = generateToken(user);
    res.status(200).json({ 
      message: '2FA verification successful', 
      token, 
      user: { id: user.user_id, name: user.full_name, role: user.role } 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during 2FA verification' });
  }
};

// @desc    Request password reset link
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const crypto = require('crypto');
    
    // Generate a secure random token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Hash it before saving to DB
    const salt = await bcrypt.genSalt(10);
    const token_hash = await bcrypt.hash(resetToken, salt);

    // Delete old reset tokens for this user
    await AuthToken.destroy({ where: { user_id: user.user_id, purpose: 'password_reset' } });

    // Save new token to DB (expires in 15 minutes)
    await AuthToken.create({
      user_id: user.user_id,
      purpose: 'password_reset',
      token_hash: token_hash,
      expires_at: new Date(Date.now() + 15 * 60000)
    });

    // The link pointing to your future frontend page
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    // Use the new template
    const emailHtml = resetPasswordTemplate(user.full_name, resetLink);

    // Send the email using our utility
    await sendEmail(user.email, 'EventGo - Password Reset Request', emailHtml);

    res.status(200).json({ message: 'Password reset link sent to your email.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during forgot password' });
  }
};

// @desc    Reset password using the token
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const authTokens = await AuthToken.findAll({ 
      where: { 
        purpose: 'password_reset',
        used_at: null
      } 
    });

    let validTokenRecord = null;

    for (const record of authTokens) {
      const isMatch = await bcrypt.compare(token, record.token_hash);
      if (isMatch) {
        validTokenRecord = record;
        break;
      }
    }

    if (!validTokenRecord) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    if (new Date() > validTokenRecord.expires_at) {
      return res.status(400).json({ message: 'Token has expired' });
    }

    const user = await User.findByPk(validTokenRecord.user_id);
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(newPassword, salt);
    await user.save();

    validTokenRecord.used_at = new Date();
    await validTokenRecord.save();

    await logAction(user.user_id, 'PASSWORD_RESET', 'User', user.user_id, 'Password reset successfully', req.ip);

    res.status(200).json({ message: 'Password reset successful. You can now login.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};