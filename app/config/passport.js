const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
// Mongoose is needed to find user that comes with the payload
const mongoose = require('mongoose');
const PT = mongoose.model('PersonalTrainer');
const Client = mongoose.model('Client');
const keys = require('../config/db');

const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    // Allows use of payload
    passport.use(
        new jwtStrategy(opts, (jwt_payload, done) =>{
            console.log(jwt_payload);
    })
    );
}


