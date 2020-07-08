const router = require('express').Router();
const passport = require('passport');
const asyncHandler = require('../middleware/async');
const { avatar } = require('../middleware/upload');
const { register, login, getMe, uploadAvatar } = require('../controllers/auth');

router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  asyncHandler(getMe),
);
router.put(
  '/me/avatar',
  passport.authenticate('jwt', { session: false }),
  avatar.single('avatar'),
  asyncHandler(uploadAvatar),
);
router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));

module.exports = router;
