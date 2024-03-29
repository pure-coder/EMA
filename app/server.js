// restful_api_server.js

// require packages so they can be used for application
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// require passport
const passport = require('passport');

// initialise app as instance of express
const app = express();

// require the routes
const users = require('./routes/users');
const authorisation = require('./routes/authorisation');
const scheduler = require('./routes/scheduler');


const log = require('./config/logger').logger;

// use scheduler to delete expired tokens
// scheduler();  /////////////// WITH LINE 7 SORT OUT CRON SCHEDULER

// assign the port that will listen on for the application
const port = process.env.PORT || 8000; // Set port to 8000

// allow app to use bodyParser so that the app can process URL encoded forms
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



// require database setup in the config folder
const db = require('./config/prod_config');

// Connect to MongoDB

mongoose
    .connect(db.mongodb.dsn, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => log.info('successfully connected to Mongodb'))
    .catch(err => console.log(err));

//require('./routes/routes')(app, log)

// Passport middleware
app.use(passport.initialize());

// Require Passport config and pass in passport
require('./config/passport')(passport);

// Use the routes that have been set up, this uses express route for our rest api (route.DELETE/GET/POST/PUT etc)
app.use('/api/', users);
app.use('/api/', authorisation);
app.use('/api/', scheduler);

// Use static server build for production
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(__dirname+ '/client/build'));
    app.get('/*', (req, res) => {
        res.sendFile(__dirname+ '/client/build/index.html');
    })
}

app.listen(port, () => {
    console.log('We are live on ' + port);
});
