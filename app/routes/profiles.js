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

// Require Client and Personal Trainer model
const Client = require('../models/Clients');
const PersonalTrainer = require('../models/PersonalTrainer');

// @route  GET client profile
// @desc   profile route for client that belongs to the personal trainer
// @access Private route for personal trainers only
router.get('/:id',  passport.authenticate('pt_rule', {session: false}),
    (req, res) => {

        const errors = {};

        // If client is associated to personal trainer that is signed in then display the clients profile
        let token = req.headers.authorization.split(' ')[1];
        let payload = jwt.decode(token, keys.secretOrKey);

        // Get array of client ids belonging to pt
        PersonalTrainer.findById(payload.id)
            .then(pt => {
                if(!pt){
                    //
                    errors.noprofile = "Personal trainer data not found";
                    return res.status(404).json(errors);
                }

                // Set client id in url to a variable
                let client_id = req.params.id;

                // Set an array of client belonging to the personal trainer
                let pt_clients = pt.ClientIDs;

                // If signed in pt has client id that matches id in url then get client profile data
                // (using the "some" function breaks the loop once value is found saving computational time
                if(pt_clients.some((element) => {
                    return element.id == client_id;
                }))
                {
                    ////////////////////////////////////////////// CHANGE CLIENT MODEL TO PROFILE MODEL //////////////////////////
                    Client.findById(client_id)
                        .then(client => {
                            if(!client){
                                errors.noprofile = "Client data not found";
                                return res.status(404).json(errors);
                            }
                            return res.json({client});
                        })
                        .catch(err => {
                            res.status(404).json({err});
                        })
                }// If signed in client matches id in url or id in url is located signed in pt's client id
                else{
                    return res.json({msg: "Unauthorised access: Profile cannot be displayed!"})
                }

            })
            .catch(err => {
                res.status(404).json({err});
            })

});

//Export router so it can work with the main restful api server
module.exports = router;