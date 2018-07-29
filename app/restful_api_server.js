// restful_api_server.js

// require packages so they can be used for application
const express        = require('express');
const bodyParser     = require('body-parser');
const mongoose       = require('mongoose');
const scheduler = require('./services/scheduler');
// require passport
const passport = require('passport');

// initialise app as instance of express
const app            = express();

// require the routes
const users = require('./routes/users');
const progression = require('./routes/progression');
const calendar = require('./routes/calendar');
const profile = require('./routes/profile');

////////////////// FOR DEV --- REMOVE /////////////////////////
const assert = require('assert');
///////////////////////////////////////////////////////////////

const log = require('./config/logger').logger;

// use scheduler
scheduler();

// assign the port that will listen on for the application
const port = 8000; // Set port to 8000

// allow app to use bodyParser so that the app can process URL encoded forms
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// require database setup in the config folder
const db = require('./config/db');

// Connect to MongoDB
mongoose
    .connect(db.mongodb.dsn)
    .then (() => log.info('successfully connected to Mongodb'))
    .catch(err => console.log(err));

//require('./routes/routes')(app, log)

// Passport middleware
app.use(passport.initialize());

// Require Passport config and pass in passport
require('./config/passport')(passport);

// Use the routes that have been set up
app.use('/users', users);
app.use('/progression', progression);
app.use('/profile', profile);
app.use('/calendar', calendar);

app.listen(port, () => {
        console.log('We are live on ' + port);
});