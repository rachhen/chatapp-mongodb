const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    chatroom: {
      type: Schema.Types.ObjectId,
      required: 'Chatroom is required!',
      ref: 'Chatroom',
    },
    user: {
      type: Schema.Types.ObjectId,
      required: 'User is required!',
      ref: 'User',
    },
    text: {
      type: String,
      required: 'Text is required!',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Message', messageSchema);
