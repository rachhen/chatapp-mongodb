require('dotenv').config();
const ioAuth = require('./middleware/ioAuth');

// Load mongodb
require('./config/database');

// Load passport
require('./config/passport');

const app = require('./app');
const Message = require('./models/Message');
const Chatroom = require('./models/Chatroom');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const io = require('socket.io')(server);

// Authication user
io.use(ioAuth);

io.on('connection', (socket) => {
  console.log('Connected: ' + socket.userId);

  socket.on('disconnect', () => {
    console.log('Disconnected: ' + socket.userId);
  });

  socket.on('createRoom', async (name) => {
    console.log(name);
    let chatroom = await Chatroom.create({ name, user: socket.userId });
    chatroom = await chatroom.populate('user').execPopulate();
    io.sockets.emit('newChatroom', chatroom);
  });

  socket.on('joinRoom', async (chatroomId) => {
    socket.join(chatroomId);
    await Chatroom.findByIdAndUpdate(chatroomId, {
      $addToSet: { user: socket.userId },
    });
    console.log('A user joined room: ' + chatroomId);
  });

  socket.on('leaveRoom', (chatroomId) => {
    socket.leave(chatroomId);
    console.log('A user left room: ' + chatroomId);
  });

  socket.on('chatroomMessage', async ({ chatroomId, text }) => {
    if (text.trim().length > 0) {
      let message = await Message.create({
        text,
        chatroom: chatroomId,
        user: socket.userId,
      });
      message = await message.populate('user').execPopulate();
      socket.broadcast.to(chatroomId).emit('newMessage', message);
      // io.to(chatroomId).emit('newMessage', message);
    }
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit
  server.close(() => process.exit(1));
});
