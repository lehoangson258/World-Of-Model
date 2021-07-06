const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const multer = require('multer');

// Config
const config = require('config');

// Connect Database
const connectDB = require('./common/database')();

// Body parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Static folder
app.use('/static', express.static(config.get('app.static_folder')));

// Ejs
app.set('views', config.get('app.view_folder'));
app.set('view engine', config.get('app.view_engine'));

// Session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))

global.loggedIn = null
app.use("*", (req, res, next) => {
  loggedIn = req.session.guestId
  next()
})

// Share
const shareMiddleware = require('./middlerware/share');
app.use(shareMiddleware)

// Router
const adminRoute = require('./routes/Admin');
app.use(adminRoute)

// Client
const clientRoute = require('./routes/Client');
app.use(clientRoute)

// Run Server
const port = config.get('app.port') || 4000;
app.listen(port, () => {
  console.log(`Sever running in http://localhost:${port}`);
});