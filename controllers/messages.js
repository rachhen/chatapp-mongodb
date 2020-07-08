const express = require('express');
const ErrorResponse = require('../utils/errorResponse');
const Message = require('../models/Message');
const Chatroom = require('../models/Chatroom');
const filterSearch = require('../middleware/filters');

/**
 * Get all messages
 * @route GET /v1/chatroom/:chatroomId/messages
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.getMessages = async (req, res, next) => {
  const chatroomId = req.params.chatroomId;
  const chatroom = await Chatroom.findById(chatroomId);

  if (!chatroom) {
    return next(
      new ErrorResponse(`Chatroom with ID ${chatroomId} not exists`, 404),
    );
  }

  const messages = await filterSearch(Message, req, 'user', {
    chatroom: chatroomId,
  });

  res.status(200).json(messages);
};

/**
 * Create message
 * @route POST /v1/chatroom/:chatroomId/messages
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.createMessage = async (req, res, next) => {
  req.body.user = req.user.id;

  const chatroomId = req.params.chatroomId;
  const chatroom = await Chatroom.findById(chatroomId);

  if (!chatroom) {
    return next(
      new ErrorResponse(`Chatroom with ID ${chatroomId} not exists`, 404),
    );
  }

  req.body.chatroom = chatroomId;
  let message = await Message.create(req.body);
  message = await message.populate('user').execPopulate();

  res.status(201).json({ success: true, data: message });
};

/**
 * Update message
 * @route PUT /v1/messages/:id
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.updateMessage = async (req, res, next) => {
  const id = req.params.id;
  const { text } = req.body;
  let message = await Message.findById(id);

  if (!message) {
    return next(new ErrorResponse(`Message with ID ${id} not exists`, 404));
  }

  message = await Message.findByIdAndUpdate(
    id,
    { text },
    { new: true, runValidators: true },
  ).populate('user');

  res.status(200).json({ success: true, data: message });
};

/**
 * Delete message
 * @route PUT /v1/messages/:id
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.deleteMessage = async (req, res, next) => {
  const id = req.params.id;
  const message = await Message.findById(id);

  if (!message) {
    return next(new ErrorResponse(`Message with ID ${id} not exists`, 404));
  }

  await message.remove();
  res.status(200).json({ success: true, data: {} });
};
