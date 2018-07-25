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
const passport = require('passport');



// Load PersonalTrainer model
const PersonalTrainer = require('../models/PersonalTrainer');
const Client = require('../models/Clients');

// @route  GET users/test
// @desc   Test users route
// @access Public
router.get('/test', (req, res) => res.json({msg: "Users Works"}));

// @route  GET users/register
// @desc   Register Personal Trainer
// @access Public
router.post('/register', upload.fields([{}]), (req, res) =>{
    // Check if email already existing in database
    PersonalTrainer.findOne({Email: req.body.Email})
        .then(PT  =>{
            // Check if PT email exists and return 400 error if it does
            if(PT) {
                return res.status(400).json({email: 'Email already exists'});
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
});

// @route  POST users/login
// @desc   Login Users (Personal Trainers and Clients) / and return JWT
// @access Public

router.post('/login', upload.fields([{}]), (req, res) =>{
    const Email = req.body.Email;
    const Password = req.body.Password;

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
                            return res.status(404).json({Email: 'User not found'});
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
                                    return res.status(400).json({msg: 'Password incorrect'})
                                }
                            })
                        if(!pt && !client){
                            return res.status(404).json({Email: 'User not found'});
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
                            return res.status(400).json({msg: 'Password incorrect'})
                        }
                    })
            }
        })

})


// @route  GET users/current
// @desc   Return current user
// @access Private
// use passport.authenticate with jwt as it is the strategy that is being used, as well as session false as we are not
// using sessions
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) =>{
    res.json({msg: 'success'});
})



//Export router so it can work with the main restful api server
module.exports = router;