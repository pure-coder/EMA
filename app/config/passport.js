const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
// Mongoose is needed to find user that comes with the payload
const mongoose = require('mongoose');
const PT = mongoose.model('personalTrainers');
const Client = mongoose.model('clients');
const keys = require('../config/db');

const opts = {};
opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    // Allows use of payload
    passport.use('pt_rule',

        // This strategy only allows the pt to access the current page, the client must also be added by finding id

        new jwtStrategy(opts, (jwt_payload, done) => {
            // Get data from model using jwt (finding user by id)
            PT.findById(jwt_payload.id)
                .then(pt => {
                    // If user has been found then return the done function which is part of strategy
                    if (pt) {
                        // First parameter of done is an err (there won't be one so we set it to null, 2nd is to pass
                        // the pt (user)
                        return done(null, pt);
                    }
                    // If user isn't found then 2nd parameter will be set to false as a user was not found
                    return done(null, false);
                })
                // Log error if something goes wrong
                .catch(err => {
                    console.log(err);
                })
        })
    );


    passport.use('client_rule',

        // This strategy only allows the client to access the current page, the client must also be added by finding id

        new jwtStrategy(opts, (jwt_payload, done) => {
            // Get data from model using jwt (finding user by id)
            Client.findById(jwt_payload.id)
                .then(client => {
                    // If user has been found then return the done function which is part of strategy
                    if (client) {
                        // First parameter of done is an err (there won't be one so we set it to null, 2nd is to pass
                        // the client (user)
                        return done(null, client);
                    }
                    // If user isn't found then 2nd parameter will be set to false as a user was not found
                    return done(null, false);
                })
                // Log error if something goes wrong
                .catch(err => {
                    console.log(err);
                })
        })
    );


    passport.use('both_rule',

        // This strategy only allows both to access the current page, the client must also be added by finding id

        new jwtStrategy(opts, (jwt_payload, done) => {
            // Get data from model using jwt (finding user by id)
            PT.findById(jwt_payload.id)
                .then(pt => {
                    // If user has been found then return the done function which is part of strategy
                    if (!pt) {
                        // If user isn't found then 2nd parameter will be set to false as a user was not found
                        //return done(null, false);
                        Client.findById(jwt_payload.id)
                            .then(client => {
                                // If user has been found then return the done function which is part of strategy
                                if (client) {
                                    // First parameter of done is an err (there won't be one so we set it to null, 2nd is to pass
                                    // the client
                                    return done(null, client);
                                }
                                // If user isn't found then 2nd parameter will be set to false as a user was not found
                                return done(null, false);
                            })
                            // Log error if something goes wrong
                            .catch(err => {
                                console.log(err);
                            })
                    }
                    else {
                        // First parameter of done is an err (there won't be one so we set it to null, 2nd is to pass
                        // the pt (user)
                        return done(null, pt);
                    }
                })
                // Log error if something goes wrong
                .catch(err => {
                    console.log(err);
                })
        })
    );
};


