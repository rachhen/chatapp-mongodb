const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatroomSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    avatar_url: {
      type: String,
    },
    user: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

chatroomSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'chatroom',
  justOne: false,
  options: { sort: { createdAt: -1 }, limit: 50, populate: 'user' },
});

module.exports = mongoose.model('Chatroom', chatroomSchema);
