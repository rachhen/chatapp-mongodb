const jwt = require('jsonwebtoken');

/**
 * Authication user on socket.io
 * @param {*} socket
 * @param {*} next
 */
module.exports = async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = payload.id;
    next();
  } catch (err) {
    console.log('err', err);
  }
};
