// server.js
import bodyParser from 'body-parser';
import logger from 'morgan';

// create our instances
const express = require('express');
const path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const app = express();

// add routes
var login = require('./routes/login')

// set our port to either a predetermined port number if you have set it up, or 3000
// now we should configure the API to use bodyParser and look for JSON data in the request body
// Serve the static files from the React app
const API_PORT = process.env.API_PORT || 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: "cis550"}));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/login', login.router);

app.get('/api', (req,res) => {
  //dummy route to test serving data to frontend
  var list = ["item1", "item2", "item3"];
  res.json(list);
});

app.get('*', login.isAuthenticated, (req,res) => {
  
});

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));