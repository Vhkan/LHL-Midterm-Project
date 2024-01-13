// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');


// const io = require('socket.io')(3000);
const PORT = process.env.PORT || 8080;

const app = express();
app.set('view engine', 'ejs');

//CookieSession encryption
app.use(cookieSession({
  name: 'session',
  keys: ['smth']
}));

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own

const usersRoutes = require('./routes/users');
const inventoryRoutes = require('./routes/inventory');
const sellRoutes = require('./routes/sell');
const messageRoutes = require('./routes/messages');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/', usersRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/sell', sellRoutes);
app.use('/messages', messageRoutes);




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
