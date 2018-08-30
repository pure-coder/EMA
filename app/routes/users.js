const express = require('express');
// set router so routes can be used
const router = express.Router();
// require bcrypt to encrypt Password
const bcrypt = require('bcryptjs');
// require jason web tokens
const jwt = require('jsonwebtoken');
// jwt keys
const keys = require('../config/db');
// require passport
const passport = require('passport');

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

// Require events
const Events = require('../models/Events');

// @route  POST /register
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
                        let now = new Date();
                        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

                        const newPT = new PersonalTrainer({
                            FullName: req.body.FullName,
                            Email: req.body.Email,
                            DateOfBirth: req.body.DateOfBirth,
                            Password: req.body.Password,
                            ContactNumber: req.body.ContactNumber,
                            Sex: req.body.Sex,
                            ProfilePicUrl: req.body.ProfilePicUrl,
                            Date: now,
                            ClientIDs: req.body.ClientIDs
                        });

                        // Encrypt Password
                        bcrypt.genSalt(12, (err, salt) => {
                            bcrypt.hash(newPT.Password, salt, (err, hash) => {
                                if (err) throw err;
                                // Set plain Password to the hash that was created for the Password
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
// @access Private route - only Personal Trainers can add new clients
router.post('/new_client', passport.authenticate('pt_rule', {session: false}) ,(req, res) =>{
    // Set up validation checking for every field that has been posted
    const {errors, isValid } = validateClientInput(req.body);

    // Check validation (so if it isn't valid give 400 error and message of error
    if(!isValid){
        return res.status(400).json(errors);
    }

    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    let PersonalTrainerId = payload.id;

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
                        let now = new Date();
                        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

                        const newClient = new Client({
                            FullName: req.body.FullName,
                            Email: req.body.Email,
                            ContactNumber: req.body.ContactNumber,
                            Date: now
                        });

                        // Save new client to database
                        newClient.save()
                            .then(client => {
                                // Send verification email to client
                                verification(req.body.Email)
                                    let client_id_object = {
                                        email: client.Email,
                                        id: client.id
                                    }
                                    // Add client id to associated personal trainer
                                    PersonalTrainer.findByIdAndUpdate(PersonalTrainerId,
                                        {$push: {ClientIDs: client_id_object}},
                                        {safe: true})
                                        .then(result =>{
                                            console.log(client_id_object),
                                            res.json({result})
                                        })
                                        .catch(err => {res.json({err})},
                                            )
                            }
                            )
                            .catch(err => {console.log(err)});
                    }

                })

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

                        // Check if user is activated before Password check and logging in
                        if(client.Activated) {
                            // If user is found continue with comparing the Password of given
                            // user with the hashed Password in the database
                            // Check Password
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
                                        errors.Password = 'Password is incorrect';
                                        return res.status(400).json(errors)
                                    }
                                })
                        } // check if user is activated
                        // Client isn't activated
                        else{
                            errors.Password = 'Client is not activated, please check your email';
                            return res.status(400).json(errors)
                        }
                        if(!pt && !client){
                            errors.Email = 'User not found';
                            return res.status(404).json(errors);
                        }
                    })
             }
            else {
                // If user is found continue with comparing the Password of given
                // user with the hashed Password in the database
                // Check Password
                bcrypt.compare(Password, pt.Password)
                // A boolean is returned if match is found or not
                    .then(isMatch =>{
                        // If it is matched then provide a token
                        if(isMatch) {
                            // User matched so create payload

                            // Create own expiration time for token
                            // let tokenExpiration = new Date().valueOf();
                            // console.log(tokenExpiration);
                            // const payload = {id: pt.id, name: pt.FullName, clients: pt.ClientIDs, exp: tokenExpiration}
                             const payload = {id: pt.id, name: pt.FullName, clients: pt.ClientIDs}

                            // Sign Token (needs payload, secret key, and expiry detail (3600 = 1hr) for re-login
                            // and callback for token
                            jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) =>{
                                //res.setHeader('Set-Cookie', 'localFitnessToken=Bearer ' + token + '; HttpOnly')
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token // Using Bearer token protocol
                                })
                            });
                        }
                        // If a match is not found provide a 400 error
                        else{
                            errors.Password = 'Password is incorrect';
                            return res.status(400).json(errors)
                        }
                    }).catch(err => console.log(err));
            }
        })

})

// @route  GET users/verify
// @desc   Activate Client from valid activation link token
// @access Public
router.get('/verify', (req, res) => {
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


//// TESTING SCHEDULER FOR LOADING FROM DB TO CLIENT

// // @route  POST /api/init
// // @desc   save data to database
// // @access private for PT's and clients
// router.post('/scheduler', passport.authenticate('both_rule', {session: false}) ,(req, res) =>{
//
//     // Initialise database with fake data for dev
//     Events.find({})
//         .then(results => {
//             if(!isEmpty(results)){
//                 console.log(results);
//             }
//             else
//             {
//                 const newEvent = new Events({
//                     text:"My test event A",
//                     start_date: new Date(2018,8,1),
//                     end_date:   new Date(2018,8,5)
//                 });
//
//                 // Save new client to database
//                 newEvent.save()
//                     .then(events => {
//                             console.log(events);
//                         }
//                     )
//                     .catch(err => {console.log(err)});
//
//                 const newEvent2 = new Events({
//                     text:"One more test event",
//                     start_date: new Date(2018,8,3),
//                     end_date:   new Date(2018,8,8),
//                     color: "#DD8616"
//                 });
//
//                 // Save new client to database
//                 newEvent2.save()
//                     .then(events => {
//                             console.log(events);
//                         }
//                     )
//                     .catch(err => {console.log(err)});
//
//             } // else
//         })// .then
//
//         res.send("Test events were added to the database")
// });// router get /scheduler


// @route  GET /api/data
// @desc   retrieve data from database
// @access private for PT's and clients
router.get('/scheduler', (req, res) =>{
    Events.find({})
        .then(data => {
            // set id property for all records
                for (let i = 0; i < data.length; i++)
                    data[i].id = data[i]._id;

                //output response
                res.send(data);
        })
        .catch(err => {console.log(err)})
}); // router get /data

// @route  POST /api/data
// @desc   Add, edit and delete data in database
// @access private for PT's and clients
router.post('/scheduler',(req, res) => {
    let data = req.body;
    console.log(data.id)

    // Get data's operation type
    let type = data["!nativeeditor_status"];

    // Get the id of the current record
    let dataId = data.id;

    // Take away data properties that won't be saved to the database
    delete data["!nativeeditor_status"];


    // Update database with confirmation to user
    function update_database(err, result){
        if (err)
            type = "error";

        console.log(dataId);
        res.setHeader("Content-Type","application/json");
        res.send({action: type, dataId: dataId});
    }
    console.log(dataId);

    // Add, edit or delete depending on the type
    if (type === "updated")
        {
            Events.findOneAndUpdate({id: dataId}, {data}, {upsert: true, new: true, runValidators: true}, update_database)
                .then(result => console.log(result))
                .catch(err => console.log(err))
        }
    else if (type === "inserted")
        {
            const newEvent = new Events({
                id: data.id,
                text: data.text,
                start_date: data.start_date,
                end_date: data.end_date
            });
            // Save new client to database
            newEvent.save()
                .then(events => {
                        console.log(events);
                    }
                )
                .catch(err => {
                    console.log(err)
                })
        }
    else if (type === "deleted")
        {
            console.log(dataId)
            Events.find({id: dataId}).remove()
                .then(result => console.log(result))
                .catch(err => console.log(err))
        }
    else
        {
            res.send("Not supported operation");
        }
}); // router post /data

//Export router so it can work with the main restful api server
module.exports = router;