const express = require('express');
const ErrorResponse = require('../utils/errorResponse');
const Chatroom = require('../models/Chatroom');
const filterSearch = require('../middleware/filters');

/**
 * Get all chatrooms
 * @route GET /v1/chatrooms
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.getChatrooms = async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create opterators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`,
  );

  // Finding resourcees
  query = Chatroom.find(JSON.parse(queryStr));

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Chatroom.countDocuments();

  query = query.skip(startIndex).limit(limit);

  query = query.populate('messages');

  // Executing query
  const results = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: results.length,
    pagination,
    data: results,
  });
};

/**
 * Get single chatroom
 * @route GET /v1/chatrooms
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.getChatroom = async (req, res, next) => {
  const roomId = req.params.id;
  const chatroom = await Chatroom.findById(roomId).populate('user');

  if (!chatroom) {
    return next(
      new ErrorResponse(`Chatroom with ID ${roomId} not exists.`, 404),
    );
  }

  res.status(200).json({ success: true, data: chatroom });
};

/**
 * Create chatroom
 * @route POST /v1/chatrooms
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.createChatroom = async (req, res, next) => {
  req.body.user = req.user.id;
  let chatroom = await Chatroom.create(req.body);
  chatroom = await chatroom.populate('user').execPopulate();
  res.status(201).json({ success: true, data: chatroom });
};

/**
 * Update chatroom
 * @route PUT /v1/chatrooms/:id
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.updateChatroom = async (req, res, next) => {
  const roomId = req.params.id;
  let chatroom = await Chatroom.findById(roomId);

  if (!chatroom) {
    return next(
      new ErrorResponse(`Chatroom with ID ${roomId} not exists`, 404),
    );
  }

  chatroom = await Chatroom.findByIdAndUpdate(roomId, req.body, {
    new: true,
    runValidators: true,
  }).populate('user');

  res.status(200).json({ success: true, data: chatroom });
};

/**
 * Delete chatroom
 * @route DELETE /v1/chatrooms/:id
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.deleteChatroom = async (req, res, next) => {
  const roomId = req.params.id;
  const chatroom = await Chatroom.findById(roomId);

  if (!chatroom) {
    return next(
      new ErrorResponse(`Chatroom with ID ${roomId} not exists`, 404),
    );
  }

  await chatroom.remove();
  res.status(200).json({ success: true, data: {} });
};
