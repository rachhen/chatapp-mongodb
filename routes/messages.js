const router = require('express').Router({ mergeParams: true });
const passport = require('passport');
const asyncHandler = require('../middleware/async');
const {
  getMessages,
  createMessage,
  updateMessage,
  deleteMessage,
} = require('../controllers/messages');

router.use(passport.authenticate('jwt', { session: false }));
router
  .route('/')
  .get(asyncHandler(getMessages))
  .post(asyncHandler(createMessage));

router
  .route('/:id')
  .put(asyncHandler(updateMessage))
  .delete(asyncHandler(deleteMessage));

module.exports = router;
