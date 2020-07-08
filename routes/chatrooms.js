const router = require('express').Router();
const passport = require('passport');
const asyncHandler = require('../middleware/async');
const {
  getChatrooms,
  getChatroom,
  createChatroom,
  updateChatroom,
  deleteChatroom,
} = require('../controllers/chatrooms');

// Authication user
router.use(passport.authenticate('jwt', { session: false }));
// Re-route into resource router
router.use('/:chatroomId/messages', require('./messages'));

router
  .route('/')
  .get(asyncHandler(getChatrooms))
  .post(asyncHandler(createChatroom));
router
  .route('/:id')
  .get(asyncHandler(getChatroom))
  .put(asyncHandler(updateChatroom))
  .delete(asyncHandler(deleteChatroom));

module.exports = router;
