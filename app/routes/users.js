const express = require('express');
// set router so routes can be used
const router = express.Router();
// require bcrypt to encrypt password
const bcrypt = require('bcryptjs');
// require jason web tokens
const jwt = require('jsonwebtoken');
// jwt keys
const keys = require('../config/db');
// require passport

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
router.post('/register', (req, res, next) =>{
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

            // Check if email doesn't exist in client database
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
router.post('/new_client', (req, res, next) =>{
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

            // Check if email exists in pt database
            PersonalTrainer.findOne({Email: req.body.Email})
                .then(PT => {
                    if(PT){
                        // Using validation to log error (this for email exists error)
                        errors.Email = 'Email already exists';
                        // Then pass errors object into returned json
                        return res.status(400).json(errors);
                    }

                    else {
                        const newClient = new Client({
                            FullName: req.body.FullName,
                            Email: req.body.Email,
                            ContactNumber: req.body.ContactNumber,
                        });

                        // Save new client to database
                        newClient.save()
                            .then(client => {
                                // Send verification email to client
                                verification(req.body.Email),
                                    res.json(client)}
                            )
                            .catch(err => console.log(err));
                    }

                })

        })
});

// @route  POST users/login
// @desc   Login Users (Personal Trainers and Clients) / and return JWT
// @access Public
router.post('/login', (req, res, next) =>{
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
router.get('/verify', (req, res, next) => {
    let activationLink = req.query.activation_link;

    // Create object of errors
    let errors = {};

    // Check that activation link is captured properly
    // console.log(activationLink);

    // Find token then update client to activated if found, also delete token after activation is complete
    ActivationTokens.find({"TokenData.Token": activationLink})
        .then(token =>{
            // Check if token is found in the database (returns empty array if token isn't found so used isEmpty)
            if(!isEmpty(token)){
                // Check token from database is returned properly
                // console.log(token);

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
                                    return res.status(200).json({msg: "Client activated"});
                                }
                            })

                    } )
                }
                else {
                    return res.status(400).json({msg: "Token expired, please contact your personal trainer for reactivation"});
                }
            // No token found in database
            }
            else{
                return res.status(400).json({msg: "Token not found"});
            }
        }).catch(err =>{
            console.log(err);
    })// catch end

})

router.get('/', (req, res) => {
    res.json({msg: "This is the users home page"})
})

//Export router so it can work with the main restful api server
module.exports = router;