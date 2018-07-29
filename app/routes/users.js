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

// Require Input validation for PT Registration
const validateRegistrationInput = require('../validation/registration');

// Require Input validation for new Client
const validateClientInput = require('../validation/newClient');

// Require Input validation for logging in PT or Client

const validateLoginInput = require('../validation/Login');

// Require isEmpty function
const isEmpty = require('../validation/is_empty');

// Require PersonalTrainer model
const PersonalTrainer = require('../models/PersonalTrainer');
const Client = require('../models/Clients');

// Require verification functionality
const verification = require('../validation/verification');

// Require verification / activation model
const ActivationTokens = require('../models/AcitvationTokens');

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
            Client.findOne({Email: req.body.Email})
                .then(client => {

                    if(client){
                        // Using validation to log error (this for email exists error)
                        errors.Email = 'Email already exists';
                        // Then pass errors object into returned json
                        return res.status(400).json(errors);
                    }

                    else
                    {
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
                                if (err) throw err;
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
        })
});

// @route  POST users/register
// @desc   Register Personal Trainer
// @access Public
router.post('/new_client', (req, res) =>{
    // Set up validation checking for every field that has been posted
    const {errors, isValid } = validateClientInput(req.body);

    // Check validation (so if it isn't valid give 400 error and message of error
    if(!isValid){
        return res.status(400).json(errors);
    }

    // Check if email already existing in database
    Client.findOne({Email: req.body.Email})
        .then(client  =>{
            // Check if Client email exists and return 400 error if it does
            if(client) {
                // Using validation to log error (this for email exists error)
                errors.Email = 'Email already exists';
                // Then pass errors object into returned json
                return res.status(400).json(errors);
            }
            // Create new user if email doesn't exist
            else {
                const newClient = new Client({
                    FullName: req.body.FullName,
                    Email: req.body.Email,
                    ContactNumber: req.body.ContactNumber,
                });

                // Save new client to database
                newClient.save()
                    .then(PT => {
                        // Send verification email to client
                        verification(req.body.Email),
                        res.json(PT)}
                    )
                    .catch(err => console.log(err));
            }
        })
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

                        // Check if user is activated before password check and logging in
                        if(client.Activated) {
                            // If user is found continue with comparing the password of given
                            // user with the hashed password in the database
                            // Check password
                            bcrypt.compare(Password, client.Password)
                            // A boolean is returned if match is found or not
                                .then(isMatch => {
                                    // If it is matched then provide a token
                                    if (isMatch) {
                                        // User matched so create payload
                                        const payload = {id: client.id, name: client.FullName}

                                        // Sign Token (needs payload, secret key, and expiry detail (3600 = 1hr) for re-login
                                        // and callback for token
                                        jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
                                            res.json({
                                                success: true,
                                                token: 'Bearer ' + token // Using Bearer token protocol
                                            })
                                        });
                                    }
                                    // If a match is not found provide a 400 error
                                    else {
                                        errors.password = 'Password is incorrect';
                                        return res.status(400).json(errors)
                                    }
                                })
                        } // check if user is activated
                        // Client isn't activated
                        else{
                            errors.password = 'Client is not activated, please check your email';
                            return res.status(400).json(errors)
                        }
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

// @route  GET users/verify
// @desc   Activate Client from valid activation link token
// @access Public
router.get('/verify', (req, res) => {
    let activationLink = req.query.activation_link;

    // Check that activation link is captured properly
    res.json(activationLink);

    // Find token then update client to activated if found, also delete token after activation is complete
    ActivationTokens.find({"TokenData.Token": activationLink})
        .then(token =>{
            // Check if token is found in the database (returns empty array if token isn't found so used isEmpty)
            if(!isEmpty(token)){
                // Check token from database is returned properly
                // console.log(token);

                // Check expiration date is still valid

                // Get current date and time
                let now = new Date();
                now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

                // Get expiration date from token
                let expiration = token[0].TokenData.ExpirationDate;
                // Get token id for deletion later
                let tokenId = token[0].id


                // Compare date to check if it is still valid (valid == true), then set client account to activated
                if(expiration >= now){
                    // Update client found by Email, update Activated field, get results from update
                    Client.update({Email : token[0].Email}, { Activated: true}, (err) => {
                        if(err) throw err;
                        ActivationTokens.findByIdAndDelete(tokenId)
                            .then(result => {
                                if(result){
                                    console.log('Client activated and token deleted')
                                }
                            })

                    } )
                }

                //////////////////// ENDED HERE /////////////////// 28/07/18
            }
            else{
                console.log('No token found')
            }
        }).catch(err =>{
            console.log(err)
    })// catch end

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