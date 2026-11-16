import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper: Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Helper: Set Secure HTTP-Only Cookie
const setAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  });
};

/**
 * @desc    Register a new student account
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, education, targetRole } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields.'
      });
    }

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // 3. Validate password strength (at least 8 chars, 1 letter, 1 number)
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.'
      });
    }
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    if (!hasLetter || !hasNumber) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one letter and one number.'
      });
    }

    // 4. Check for duplicate email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // 5. Hash password with bcryptjs (12 salt rounds for strong security)
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // 6. Create student user in MongoDB
    const user = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      passwordHash,
      education: education ? education.trim() : 'B.Tech Data Science',
      targetRole: targetRole ? targetRole.trim() : 'Software Engineer'
    });

    // 7. Establish authenticated session via JWT in HTTP-only cookie
    const token = generateToken(user._id);
    setAuthCookie(res, token);

    // 8. Return response (user.toJSON() automatically removes passwordHash)
    res.status(201).json({
      success: true,
      message: 'Student account registered successfully.',
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again later.'
    });
  }
};

/**
 * @desc    Authenticate student & obtain session
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Lookup user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // 3. Compare hashed password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // 4. Generate JWT & Set Secure Cookie
    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again later.'
    });
  }
};

/**
 * @desc    Get current authenticated student profile
 * @route   GET /api/auth/me
 * @access  Private (JWT protected)
 */
export const getMe = async (req, res) => {
  try {
    // req.user was populated by protect middleware (excluding passwordHash)
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving student profile.'
    });
  }
};

/**
 * @desc    Log out student and clear HTTP-only session cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logoutUser = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
      sameSite: 'lax',
      secure: isProduction
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout.'
    });
  }
};
