// restful_api_server.js

// require packages so they can be used for application
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const scheduler = require('./services/scheduler'); ////////////////// SORT OUT 24HR CRON ////////////////
// require passport
const passport = require('passport');

// initialise app as instance of express
const app = express();

// require the routes
const users = require('./routes/users');
const personalTrainer = require('./routes/personalTrainer');
const client = require('./routes/client');
const profile = require('./routes/profile');
const profiles = require('./routes/profiles');
const calendar = require('./routes/calendar');

////////////////// FOR DEV --- REMOVE /////////////////////////
const assert = require('assert');
///////////////////////////////////////////////////////////////

const log = require('./config/logger').logger;

// use scheduler to delete expired tokens
// scheduler();  /////////////// WITH LINE 7 SORT OUT CRON SCHEDULER

// assign the port that will listen on for the application
const port = process.env.PORT || 8000; // Set port to 8000

// allow app to use bodyParser so that the app can process URL encoded forms
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// require database setup in the config folder
const db = require('./config/db');

// Connect to MongoDB

mongoose
    .connect(db.mongodb.dsn)
    .then(() => log.info('successfully connected to Mongodb'))
    .catch(err => console.log(err));

//require('./routes/routes')(app, log)

// Passport middleware
app.use(passport.initialize());

// Require Passport config and pass in passport
require('./config/passport')(passport);

// Use the routes that have been set up
app.use('/api/', users);
// app.use('/api/personal_trainer', personalTrainer);
// app.use('/api/client', client);
// app.use('/api/personal_trainer/client/profile', profiles);
// app.use('/api/client/profile', profile);
// app.use('/api/client/calendar', calendar);

app.listen(port, () => {
    console.log('We are live on ' + port);
});