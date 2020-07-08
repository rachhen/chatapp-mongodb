const path = require('path');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const fileupload = require('express-fileupload');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');

const errorHandler = require('./middleware/error');
const { generator } = require('./utils');

const app = express();

//Initialize passport
app.use(passport.initialize());

// Serve Static site
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create a rotating write stream
var accessLogStream = rfs.createStream(generator, {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log'),
});

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

// File uploading
// app.use(fileupload());

// Sanitize
app.use(mongoSanitize());

// Add security headers
app.use(helmet());

// Prevent XSS attack
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Prevent http param pullution
app.use(hpp());

// Setup CROSS ORIGIN
app.use(cors());

// Mount Routes
app.use('/v1', require('./routes'));

// error handler
app.use(errorHandler);

module.exports = app;
