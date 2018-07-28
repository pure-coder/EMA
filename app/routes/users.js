const express = require('express');
// set router so routes can be used
const router = express.Router();
// used to parse mult-part forms
const multer = require('multer');
const upload = multer();
// require bcrypt to encrypt password
const bcrypt = require('bcryptjs');
// require jason web tokens
const jwt = require('jsonwebtoken');
// jwt keys
const keys = require('../config/db');
// require passport
const passport_pt = require('passport');
const passport_client = require('passport');
const passport_both = require('passport');

// Require Input validation for PT Registration and Login
const validateRegistrationInput = require('../validation/registration');
const validateLoginInput = require('../validation/Login');

// Require PersonalTrainer model
const PersonalTrainer = require('../models/PersonalTrainer');
const Client = require('../models/Clients');

const verification = require('../validation/verification');
//verification();

// @route  POST users/register
// @desc   Register Personal Trainer
// @access Public
router.post('/register', (req, res) =>{
    // Set up validation checking for every field that has been posted
    const {errors, isValid } = validateRegistrationInput(req.body);

    // Check validation (so if it isn't valid give 400 error and message of error
    if(!isValid){
        return res.status(400).json(errors);
    }

    // Check if email already existing in database
    PersonalTrainer.findOne({Email: req.body.Email})
        .then(PT  =>{
            // Check if PT email exists and return 400 error if it does
            if(PT) {
                // Using validation to log error (this for email exists error)
                errors.Email = 'Email already exists';
                // Then pass errors object into returned json
                return res.status(400).json(errors);
            }
            // Create new user if email doesn't exist
            else {
                const newPT = new PersonalTrainer({
                    FullName: req.body.FullName,
                    Email: req.body.Email,
                    DateOfBirth: req.body.DateOfBirth,
                    Password: req.body.Password,
                    ContactNumber: req.body.ContactNumber,
                    Sex: req.body.Sex,
                    ProfilePicUrl: req.body.ProfilePicUrl,
                    ClientIDs: req.body.ClientIDs
                });

                // Encrypt password
                bcrypt.genSalt(12, (err, salt) => {
                    bcrypt.hash(newPT.Password, salt, (err, hash) => {
                        if(err) throw err;
                        // Set plain password to the hash that was created for the password
                        newPT.Password = hash;
                        // Save new Personal Trainer to the database
                        newPT.save()
                            .then(PT => res.json(PT))
                            .catch(err => console.log(err));
                    })
                })
            }
        })

    // check verification
    console.log(verification(req.body.Email));
});

// @route  POST users/login
// @desc   Login Users (Personal Trainers and Clients) / and return JWT
// @access Public
router.post('/login', (req, res) =>{
    const Email = req.body.Email;
    const Password = req.body.Password;

    // Set up validation checking for every field that has been posted
    const {errors, isValid } = validateLoginInput(req.body);

    // Check validation (so if it isn't valid give 400 error and message of error
    if(!isValid){
        return res.status(400).json(errors);
    }

        PersonalTrainer.findOne({Email})
        // Check for user
        .then(pt => {
            // This will be false if a match is not found for the user
            // if that is the case return 404 error status with a message
            if(!pt){
                Client.findOne({Email})
                // Check for user
                    .then(client => {
                        // This will be false if a match is not found for the user
                        // if that is the case return 404 error status with a message
                        if(!client){
                            // if Personal client is found this will get over written with a success msg
                            errors.Email = 'User not found';
                            return res.status(404).json(errors);
                        }

                        // If user is found continue with comparing the password of given
                        // user with the hashed password in the database
                        // Check password
                        bcrypt.compare(Password, client.Password)
                        // A boolean is returned if match is found or not
                            .then(isMatch =>{
                                // If it is matched then provide a token
                                if(isMatch) {
                                    // User matched so create payload
                                    const payload = {id: client.id, name: client.FullName}

                                    // Sign Token (needs payload, secret key, and expiry detail (3600 = 1hr) for re-login
                                    // and callback for token
                                    jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) =>{
                                        res.json({
                                            success: true,
                                            token: 'Bearer ' + token // Using Bearer token protocol
                                        })
                                    });
                                }
                                // If a match is not found provide a 400 error
                                else{
                                    errors.password = 'Password is incorrect';
                                    return res.status(400).json(errors)
                                }
                            })
                        if(!pt && !client){
                            errors.Email = 'User not found';
                            return res.status(404).json(errors);
                        }
                    })
             }
            else {
                // If user is found continue with comparing the password of given
                // user with the hashed password in the database
                // Check password
                bcrypt.compare(Password, pt.Password)
                // A boolean is returned if match is found or not
                    .then(isMatch =>{
                        // If it is matched then provide a token
                        if(isMatch) {
                            // User matched so create payload
                            const payload = {id: pt.id, name: pt.FullName, clients: pt.ClientIDs}

                            // Sign Token (needs payload, secret key, and expiry detail (3600 = 1hr) for re-login
                            // and callback for token
                            jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) =>{
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token // Using Bearer token protocol
                                })
                            });
                        }
                        // If a match is not found provide a 400 error
                        else{
                            errors.password = 'Password is incorrect';
                            return res.status(400).json(errors)
                        }
                    })
            }
        })

})


// @route  GET users/current/personalTrainers
// @desc   Return current user
// @access Private
// use passport.authenticate with jwt as it is the strategy that is being used, as well as session false as we are not
// using sessions (passport_pt.authenticate with pt_rule for personal trainers only)
router.get('/current/personalTrainers', passport_pt.authenticate('pt_rule', {session: false}), (req, res) =>{
    res.json(req.user);
})


// @route  GET users/current_clients
// @desc   Return current user
// @access Private
// use passport.authenticate with jwt as it is the strategy that is being used, as well as session false as we are not
// using sessions (passport_client.authenticate with client_rule for clients only)
router.get('/current/clients', passport_client.authenticate('client_rule', {session: false}), (req, res) =>{
    res.json(req.user);
})

// @route  GET users/current/both
// @desc   Return current user
// @access Private
// use passport.authenticate with jwt as it is the strategy that is being used, as well as session false as we are not
// using sessions (passport_both.authenticate both_rule for both)
router.get('/current/both', passport_both.authenticate('both_rule', {session: false}), (req, res) =>{
    res.json({
        id: req.user.id,
        name: req.user.FullName,
        email: req.user.Email
    });
})

//Export router so it can work with the main restful api server
module.exports = router;