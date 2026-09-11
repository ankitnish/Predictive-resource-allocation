const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { success, failure } = require('../utils/response');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName || !email || !password) {
    return failure(res, 'fullName, email, and password are required', 422);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return failure(res, 'Email already registered', 409);
  }

  const allowedRoles = ['admin', 'coordinator', 'analyst'];
  const finalRole = allowedRoles.includes(role) ? role : 'analyst';

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    passwordHash,
    role: finalRole,
  });

  const token = generateToken(user);

  return success(res, {
    token,
    user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
  }, 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return failure(res, 'email and password are required', 422);
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.isActive) {
    return failure(res, 'Invalid credentials', 401);
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return failure(res, 'Invalid credentials', 401);
  }

  const token = generateToken(user);

  return success(res, {
    token,
    user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
  });
});

module.exports = { register, login };