const express = require('express');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

/**
 * Register new user
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });

  const token = user.getSignedJwtToken();
  res.status(201).json({ success: true, token, user });
};

/**
 * Login user
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 400));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 400));
  }

  const token = user.getSignedJwtToken();
  user.password = undefined;
  res.status(200).json({ success: true, token, user });
};

/**
 * Get logged user profile
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
};

/**
 * Upload file
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.uploadAvatar = async (req, res, next) => {
  let user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 400));
  }

  user.avatar = req.file.path;
  user = await user.save();
  res.status(200).json({ success: true, data: user });
};
