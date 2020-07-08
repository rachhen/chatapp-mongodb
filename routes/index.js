const router = require('express').Router();

router.use('/auth', require('./auth'));
router.use('/chatrooms', require('./chatrooms'));
router.use('/messages', require('./messages'));

module.exports = router;
