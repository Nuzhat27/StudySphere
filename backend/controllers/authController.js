const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, registrationNumber } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already registered' });

    // Only allow student/educator at signup — admin accounts are
    // provisioned manually, never through public registration.
    const safeRole = ['student', 'educator'].includes(role) ? role : 'student';

    const trimmedRegNo = registrationNumber?.trim();
    if (safeRole === 'student' && !trimmedRegNo) {
      return res.status(400).json({ message: 'Registration number is required for students' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: safeRole,
      // Omit entirely when absent (rather than saving '') so the sparse
      // unique index doesn't treat every empty string as a collision.
      ...(trimmedRegNo ? { registrationNumber: trimmedRegNo } : {}),
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      registrationNumber: user.registrationNumber,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account has been deactivated' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      registrationNumber: user.registrationNumber,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { registerUser, loginUser, getMe };
