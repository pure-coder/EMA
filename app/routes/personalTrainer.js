const express = require('express');
// set router so routes can be used
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Require models
const client_progression = require('../models/ClientProgression');
const exercise = require('../models/Exercise');
const PT = require('../models/PersonalTrainer');
const client = require('../models/Clients');

// @route  GET personal_trainer/test
// @desc   Test personalTrainer route
// @access Public route


//Export router so it can work with the main restful api server
module.exports = router;