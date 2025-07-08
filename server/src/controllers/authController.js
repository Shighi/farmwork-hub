const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { AppError, catchAsync } = require('../middleware/errorHandler');
const { sendEmail } = require('../services/emailService');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// Register new user
const register = catchAsync(async (req, res, next) => {
  const { email, password, firstName, lastName, phoneNumber, location, userType } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return next(new AppError('User with this email already exists', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      location,
      userType,
      isVerified: false,
      rating: 0,
      totalRatings: 0
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      location: true,
      userType: true,
      isVerified: true,
      profilePicture: true,
      bio: true,
      skills: true,
      rating: true,
      totalRatings: true,
      createdAt: true
    }
  });

  const token = generateToken(user.id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { user, token }
  });
});

// Login user
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  const token = generateToken(user.id);
  const { password: _, ...userWithoutPassword } = user;

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { user: userWithoutPassword, token }
  });
});

// Logout user
const logout = catchAsync(async (req, res, next) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// Get current user
const getMe = catchAsync(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      location: true,
      userType: true,
      isVerified: true,
      profilePicture: true,
      bio: true,
      skills: true,
      rating: true,
      totalRatings: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({ success: true, data: { user } });
});

// Forgot password
const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return next(new AppError('No user found with this email address', 404));
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry }
  });

  const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const message = `
    <h1>Password Reset Request</h1>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetURL}">${resetURL}</a>
    <p>This link will expire in 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request - FarmWork Hub',
    html: message
  });

  res.status(200).json({ success: true, message: 'Password reset email sent' });
});

// Reset password
const resetPassword = catchAsync(async (req, res, next) => {
  const { token, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() }
    }
  });

  if (!user) {
    return next(new AppError('Invalid or expired reset token', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null }
  });

  res.status(200).json({ success: true, message: 'Password reset successful' });
});

// Refresh token
const refreshToken = catchAsync(async (req, res, next) => {
  const user = req.user;
  const token = generateToken(user.id);

  res.status(200).json({ success: true, data: { token } });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  refreshToken
};