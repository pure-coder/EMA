const express = require('express');
// set router so routes can be used
const router = express.Router();

// Require passport to control access to routes
const passport = require('passport');

// require jason web tokens
const jwt = require('jsonwebtoken');
// jwt keys
const keys = require('../config/db');

////////////////////////////////////////////// CHANGE CLIENT MODEL TO PROFILE MODEL //////////////////////////

// Require Client model
const Client = require('../models/Clients');

// @route  GET profile/test
// @desc   Test profile route
// @access Private route for clients only
router.get('/:id', passport.authenticate('client_rule', {session: false}),
    (req, res) => {

        const errors = {};

        // If client display profile and If client is associated to personal trainer display profile
        let token = req.headers.authorization.split(' ')[1];
        let payload = jwt.decode(token, keys.secretOrKey);
        let user_id = payload.id;

        // If signed in client matches id in url then get client profile data
        if (req.params.id === user_id) {
            ////////////////////////////////////////////// CHANGE CLIENT MODEL TO PROFILE MODEL //////////////////////////
            Client.findById(user_id)
                .then(client => {
                    if (!client) {
                        errors.noprofile = "Client data not found";
                        return res.status(404).json(errors);
                    }
                    return res.json({client});
                })
                .catch(err => {
                    res.status(404).json({err});
                })
        }// If signed in client matches id in url or id in url is located signed in pt's client id
        else {
            return res.json({msg: "Unauthorised access: Profile cannot be displayed!"})
        }

    });

//Export router so it can work with the main restful api server
module.exports = router;