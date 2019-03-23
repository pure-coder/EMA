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

// Require Input validation for editing client profile
const validateEditClientInput = require('../validation/editClient');

// Require Input validation for logging in PT or Client
const validateLoginInput = require('../validation/Login');

// Require Input validation for new progress data for client
const validateNewProgressInput = require('../validation/newProgress');

// Require isEmpty function
const isEmpty = require('../validation/is_empty');

// Require PersonalTrainer model
const PersonalTrainer = require('../models/PersonalTrainer');
const Client = require('../models/Clients');

// Require ClientProgression model
const ClientProgression = require('../models/ClientProgression');

// Require verification / activation model
const ActivationTokens = require('../models/AcitvationTokens');

// Require events
const Events = require('../models/Events');

// Require verification functionality
const verification = require('../validation/verification');

// Capitalise 1st letter !!!!!!!!!!!!!!!!!! MOVE THIS TO SEPARATE FILE
function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// @route  POST /register
// @desc   Register Personal Trainer
// @access Public
router.post('/register', (req, res) => {
    // Set up validation checking for every field that has been posted
    const {errors, isValid} = validateRegistrationInput(req.body);

    // Check validation (so if it isn't valid give 400 error and message of error
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Check if email already existing in database
    PersonalTrainer.findOne({Email: req.body.Email})
        .then(PT => {
            // Check if PT email exists and return 400 error if it does
            if (PT) {
                // Using validation to log error (this for email exists error)
                errors.Email = 'Email already exists';
                // Then pass errors object into returned json
                return res.status(400).json(errors);
            }
            // Create new user if email doesn't exist

            // Check if email doesn't exist in client database
            Client.findOne({Email: req.body.Email})
                .then(client => {

                    if (client) {
                        // Using validation to log error (this for email exists error)
                        errors.Email = 'Email already exists';
                        // Then pass errors object into returned json
                        return res.status(400).json(errors);
                    }

                    else {
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

// @route  POST api/new_client
// @desc   Register Personal Trainer
// @access Private route - only Personal Trainers can add new clients
router.post('/new_client', passport.authenticate('pt_rule', {session: false}), (req, res) => {
    // Set up validation checking for every field that has been posted
    const {errors, isValid} = validateClientInput(req.body);

    // Check validation (so if it isn't valid give 400 error and message of error
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    let PersonalTrainerId = payload.id;

    // Check if email already existing in database
    Client.findOne({Email: req.body.Email})
        .then(client => {
            // Check if Client email exists and return 400 error if it does
            if (client) {
                // Using validation to log error (this for email exists error)
                errors.Email = 'Email already exists';
                // Then pass errors object into returned json
                return res.status(400).json(errors);
            }

            // Create new user if email doesn't exist
            // Check if email exists in pt database
            PersonalTrainer.findOne({Email: req.body.Email})
                .then(PT => {
                    if (PT) {
                        // Using validation to log error (this for email exists error)
                        errors.Email = 'Email already exists';
                        // Then pass errors object into returned json
                        return res.status(400).json(errors);
                    }

                    else {
                        let now = new Date();
                        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

                        const newClient = new Client({
                            FullName: req.body.FullName = capitaliseFirstLetter(req.body.FullName),
                            Email: req.body.Email,
                            ContactNumber: req.body.ContactNumber,
                            Date: now,
                            ptId: PersonalTrainerId
                        });

                        // Save new client to database and push basic client details to personal trainers ClientIDs
                        newClient.save()
                            .then(client => {
                                    // Send verification email to client
                                    verification(req.body.Email);

                                    // Add client id to associated personal trainer ClientIDs
                                    PersonalTrainer.findByIdAndUpdate(PersonalTrainerId,
                                        {$push: {ClientIDs: client._id}}, // changed from client_id_object to client._id (for ref)
                                        {safe: true})
                                        .then(result => {
                                            // console.log(client_id_object),
                                            res.json({result})
                                        })
                                        .catch(err => {
                                            res.json({err})
                                        })
                                }
                            )
                            .catch(err => res.json({err})); // catch client save
                    } // else

                }).catch(err => res.json({err})) // catch pt find

        }).catch(err => res.json({err})) // catch client find
});

// @route  POST api/login
// @desc   Login Users (Personal Trainers and Clients) / and return JWT
// @access Public
router.post('/login', (req, res) => {
    const Email = req.body.Email;
    const Password = req.body.Password;

    // Set up validation checking for every field that has been posted
    const {errors, isValid} = validateLoginInput(req.body);

    // Check validation (so if it isn't valid give 400 error and message of error
    if (!isValid) {
        return res.status(400).json(errors);
    }

    PersonalTrainer.findOne({Email})
    // Check for user
        .then(pt => {
            // This will be false if a match is not found for the user
            // if that is the case return 404 error status with a message
            if (!pt) {
                Client.findOne({Email})
                // Check for user
                    .then(client => {
                        // This will be false if a match is not found for the user
                        // if that is the case return 404 error status with a message
                        if (!client) {
                            // if Personal client is found this will get over written with a success msg
                            errors.Email = 'User not found';
                            return res.status(404).json(errors);
                        }

                        // Check if user is activated before Password check and logging in
                        if (client.Activated) {
                            // If user is found continue with comparing the Password of given
                            // user with the hashed Password in the database
                            // Check Password
                            bcrypt.compare(Password, client.Password)
                            // A boolean is returned if match is found or not
                                .then(isMatch => {
                                    // If it is matched then provide a token
                                    if (isMatch) {
                                        // User matched so create payload for client
                                        const payload = {id: client.id, name: client.FullName, pt: false};

                                        // Sign Token (needs payload, secret key, and expiry detail (3600 = 1hr) for re-login
                                        // and callback for token
                                        jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
                                            if (token){
                                                res.json({
                                                    success: true,
                                                    token: 'Bearer ' + token // Using Bearer token protocol
                                                })
                                            }
                                            else{
                                                res.json(err);
                                            }
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
                        else {
                            errors.Password = 'Client is not activated, please check your email';
                            return res.status(400).json(errors)
                        }
                        if (!pt && !client) {
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
                    .then(isMatch => {
                        // If it is matched then provide a token
                        if (isMatch) {
                            // User matched so create payload for pt
                            const payload = {id: pt.id, name: pt.FullName, pt: true};

                            // Sign Token (needs payload, secret key, and expiry detail expressed in seconds
                            //  60s * 60m = (3600s = 1hr) for re-login and callback for token
                            // exp and iat for expired time sent with token (format is in epoch timestamp
                            jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
                                //res.setHeader('Set-Cookie', 'localFitnessToken=Bearer ' + token + '; HttpOnly')
                                if (token){
                                    res.json({
                                        success: true,
                                        token: 'Bearer ' + token // Using Bearer token protocol
                                    })
                                }
                                else{
                                    res.json(err);
                                }
                            });
                        }
                        // If a match is not found provide a 400 error
                        else {
                            errors.Password = 'Password is incorrect';
                            return res.status(400).json(errors)
                        }
                    }).catch(err => console.log(err));
            }
        })

});

// @route  GET api/verify
// @desc   Activate Client from valid activation link token
// @access Public
router.get('/verify', (req, res) => {
    let activationLink = req.query.activation_link;

    // Check that activation link is captured properly
    // console.log(activationLink);

    // Find token then update client to activated if found, also delete token after activation is complete
    ActivationTokens.findOne({"TokenData.Token": activationLink})
        .then(token => {
            // Check if token is found in the database (returns empty array if token isn't found so used isEmpty)
            if (!isEmpty(token)) {
                // Check token from database is returned properly
                // console.log(token);

                // Get current date and time
                let now = new Date();
                now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

                // Get expiration date from token
                let expiration = token[0].TokenData.ExpirationDate;
                // Get token id for deletion later
                let tokenId = token[0].id;


                // Compare date to check if it is still valid (valid == true), then set client account to activated
                if (expiration >= now) {
                    // Update client found by Email, update Activated field, get results from update
                    Client.update({Email: token[0].Email}, {Activated: true}, (err) => {
                        if (err) throw err;
                        ActivationTokens.findByIdAndDelete(tokenId)
                            .then(result => {
                                if (result) {
                                    return res.status(200).json({msg: "Client activated"});
                                }
                            })

                    })
                }
                else {
                    return res.status(400).json({msg: "Token expired, please contact your personal trainer for reactivation"});
                }
                // No token found in database
            }
            else {
                return res.status(400).json({msg: "Token not found"});
            }
        }).catch(err => {
        console.log(err);
    })// catch end

});

// @route  GET api/:id/scheduler/:cid?
// @desc   Workout scheduler - retrieve data from database for client
// @access private for PT's and clients
router.get('/:id/scheduler/:cid', passport.authenticate('both_rule', {session: false}), (req, res) => {

    // Get clientId from frontEnd
    let userId = req.params.id;
    let clientId = req.params.cid;

    // Check authentication of the current user, will also be used to verify if they can access data
    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    let userTokenId = payload.id;
    let isPT = payload.pt;

    // If user is pt check to see if the client id is in their list, if so allow them access to data
    if (isPT && userTokenId === userId) {
        PersonalTrainer.findOne({"_id": userTokenId}).populate('ClientIDs')
            .then(pt => {
                // Make sure that the pt exists
                if (pt) {
                    let clientIds = pt.ClientIDs;
                    // Check to see if client id is in the pt clients list
                    let checkClientId = clientIds.find(function (checkClientId) {
                        return checkClientId.id === clientId
                    });
                    // If id is in pt client id list then display events for client
                    if (checkClientId !== undefined) {
                        // Find all events that have clientId
                        Events.find({clientId})
                            .then(data => {
                                // set id property for all records
                                for (let i = 0; i < data.length; i++)
                                    data[i].id = data[i]._id;

                                //output response
                                return res.send(data);
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }
                    else {
                        // Send empty data so scheduler gets rendered
                        let data = [];
                        return res.json(data);
                    }
                }
            })
            .catch(err => {
                return res.json({err})
            }) // catch pt find
    }
    // Make sure that params id and cid match and that they match userTokenId
    else if (clientId === userId && clientId === userTokenId) {
        // Find all events for clientId
        Events.find({clientId})
            .then(data => {
                // set id property for all records
                for (let i = 0; i < data.length; i++)
                    data[i].id = data[i]._id;

                return res.json(data);
            })
            .catch(err => {
                return res.json(err);
            })
    }
    else {
        // Send empty data so scheduler gets rendered
        let data = [];
        return res.json(data);
    }
}); // router get /scheduler

// @route  POST api/scheduler
// @desc   Add, edit and delete data in database
// @access private for PT's - clients can't post to the scheduler
router.post('/:id/scheduler/:cid', passport.authenticate('pt_rule', {session: false}), (req, res) => {
    let data = req.body;
    let schedId, docId; // initialising schedule id and document id

    // Get clientId from frontEnd
    let userId = req.params.id;
    let clientId = req.params.cid;

    // Check authentication of the current user, will also be used to verify if they can access data
    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    let isPT = payload.pt;

    // If user is PT then userId will be of pt so change clientId to userId, so that userId is that of the client
    if (isPT) {
        userId = clientId;
    }

    // Had to rename keys to the data sent as dhtmlxscheduler added the id number into the key
    let addedId = data.ids + '_';
    for (let k in data) {
        if (data.hasOwnProperty(k)) {
            let oldKey = k;
            let newKey = k.replace(addedId, '');
            Object.defineProperty(data, newKey,
                Object.getOwnPropertyDescriptor(data, oldKey));
            delete data[oldKey];
        }
    } // for

    // Get data's operation type which is either inserted/updated/deleted
    let type = data["!nativeeditor_status"];

    // Get the id of current record as inserted code id is different from updated/delete as dhtmlxscheduler changes
    // the id to the document id from mongodb database for edited events
    if (type === 'inserted') {
        schedId = data.id;
    }
    else {
        docId = data.id;
    }

    // Added for key to updating/removing event as the scheduler was weird when creating (new event) then updating an event as the id would change length
    let thisId;
    data.id.length === 24 ? thisId = "_id" : thisId = "id";

    // Take away data properties that won't be saved to the database
    delete data["!nativeeditor_status"];

    // Add, edit or delete depending on the type
    if (type === "updated") {
        // Update the existing workout using the document id
        Events.update({[thisId]: docId},
            {
                text: data.text,
                start_date: data.start_date,
                end_date: data.end_date,
                clientId: clientId
            }, {upsert: true, runValidators: true, new: true})
            .then(result => {
                if (result) {
                    // Because of the way mongoose update works update needs to be performed as it makes a new
                    // doc as id are unique, have to delete old doc with previous id so new and updated doc
                    // do not appear on schedule
                    return res.status(200).json(result);
                }
            })
            .catch(err => {
                return res.status(400).json(err);
            })
    }
    else if (type === "inserted") {
        // Create new workout for client
        const newWorkout = new Events({
            id: schedId,
            text: data.text,
            start_date: data.start_date,
            end_date: data.end_date,
            clientId: userId
        });
        // Save new workout to database
        newWorkout.save()
            .then(events => {
                    //console.log(events);
                    return res.status(200).json(events);
                }
            )
            .catch(err => {
                return res.status(400).json(err);
            })
    }
    else if (type === "deleted") {
        // Remove the workout from the schedule that user has deleted

        Events.remove({[thisId]: docId}).remove()
            .then(result => {
                    return res.status(200).json(result)
                }
            )
            .catch(err => {
                return res.status(400).json(err)
            })
    }
    else {
        res.send("Not supported operation");
    }
}); // router post /scheduler


// @route  GET api/pt_clients/:ptid
// @desc   get up to date clients of personal trainer
// @access private for PT's
router.get('/pt_clients/:ptid', passport.authenticate('pt_rule', {session: false}), (req, res) => {
    let ptId = req.params.ptid;
    // get personal trainers client list
    PersonalTrainer.findOne({_id: ptId}).populate('ClientIDs', '-Password -Date -Activated -__v')
        .exec(function (err, personalTrainer) {
                if (err) return res.json("No data for ptid: " + err.stringValue);

                if (personalTrainer) {
                    return res.json(personalTrainer.ClientIDs)
                }
            }
        ) // Client.findOne


});
// router get /pt_clients


// @route  DELETE api/delete_client
// @desc   delete client, delete them from pt ClientIDs, Events and Event progression
// @access private for PT's
router.delete('/delete_client/:cid', passport.authenticate('pt_rule', {session: false}), (req, res) => {

    let clientId = req.params.cid;
    // Delete the client
    Client.findOne({_id: clientId})
        .then(client => {
                if (client) {
                    // Had to change $unset to $pull
                    PersonalTrainer.update({_id: client.ptId}, {$pull: {ClientIDs: {id: client.id}}})
                        .then(pt => {
                            if (pt) {
                                Client.remove({_id: clientId}).remove()
                                    .then(result => {
                                        if (result) {
                                            Events.remove({clientId: clientId})
                                                .then(events => {
                                                        return res.json({events})
                                                        // console.log( "Events deleted for user: " + client.FullName + " ", events)
                                                    }
                                                )
                                                // Events.remove
                                                .catch(err => {
                                                    return res.json({err})
                                                })
                                        }
                                        // console.log("Deletion of user: " + client.FullName + " ", result)
                                    })
                                    // Client.remove
                                    .catch(err => {
                                        return res.json({err})
                                    })
                            }
                        })
                        // PersonalTrainer.update
                        .catch(err => {
                            return res.json({err})
                        })
                }
            }
        ) // then Client.findOne
        .catch(err => {
            return res.json({err})
        })

}); // router post /delete_client

// @route  GET api/client/:id
// @desc   get client data
// @access private for PT's and client
router.get('/client/:id', passport.authenticate('both_rule', {session: false}), (req, res) => {
    let id = req.params.id;
    // get client data
    Client.findOne({_id: id})
        .then(client => {
                if (client) {
                    let data = {};
                    data.FullName = client.FullName;
                    data.DateOfBirth = client.DateOfBirth;
                    data.Email = client.Email;
                    data.ContactNumber = client.ContactNumber;
                    data.ProfilePicUrl = client.ProfilePicUrl;
                    data.Sex = client.Sex;
                    return res.json(data)
                }
                // if client is null
                else {
                    return res.json("No data for id: " + id)
                }
            }
        ) // then Client.findOne
        .catch(err => {
            return res.json("No data for id: " + err.stringValue)
        })

});
// router GET /client/:id

// @route  PUT /edit_client/:id
// @desc   Update client profile data
// @access Private access for either personal trainer or client
router.put('/edit_client/:id', passport.authenticate('both_rule', {session: false}), (req, res) => {
    // Set up validation checking for every field that has been posted
    const clientId = req.params.id;

    let updateClient = {};
    // Enter data into updateClient only if the value of req.body is not undefined or an empty string
    for (let value in req.body) {
        if (req.body[value] !== '' && req.body[value] !== undefined) {
            // Capitalise first name if not alread done
            if (req.body.FullName) {
                req.body.FullName = capitaliseFirstLetter(req.body.FullName);
            }
            updateClient[value] = req.body[value];
        }
    } // for value in req.body

    const {errors, isValid} = validateEditClientInput(updateClient);

    // Check validation (so if it isn't valid give 400 error and message of error, status(400) makes sure the response is caught and not successful for authenticationAction editClientData
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // If it exists as the for loop above checked if password was null or undefined, hash the password and update client profile if password doesn't exist update profile without hashing non existent password
    if (updateClient.Password) {

        // This can be done synchronously via bcrypt.genSaltSync and bcrypt.hashSync, but for better performance async is used so the
        // encrypting of users passwords does not tie up the node.js thread.
        bcrypt.genSalt(12, (err, salt) => {
            bcrypt.hash(updateClient.Password, salt, (err, hash) => {
                if (err) throw err;
                // Set plain Password to the hash that was created for the Password
                updateClient.Password = hash;
                // TODO::
                // Update password in client database
                Client.findByIdAndUpdate(clientId, updateClient, {new: true})
                    .then(result => {
                        return res.json(result)
                    })
                    .catch(err => {
                        return res.json(err)
                    });
            })
        })
    }
    else {
        // Find client by id
        Client.findByIdAndUpdate(clientId, updateClient, {new: true})
            .then(client => {
                if (client) {
                    return res.json(client)
                }
            })
            .catch(err => {
                return res.json(err)
            });
    }


}); // PUT /edit_client/:id

// @route  GET api/personal_trainer/:id
// @desc   get personal trainer data
// @access private for PT's and client
router.get('/personal_trainer/:id', passport.authenticate('pt_rule', {session: false}), (req, res) => {
    let id = req.params.id;
    // get client data
    PersonalTrainer.findOne({_id: id})
        .then(pt => {
                if (pt) {
                    let data = {};
                    data.FullName = pt.FullName;
                    data.Email = pt.Email;
                    data.Sex = pt.Sex;
                    data.ProfilePicUrl = pt.ProfilePicUrl;
                    return res.json(data)
                }
                // if pt is null
                else {
                    return res.json("No data for id: " + id)
                }
            }
        ) // then PersonalTrainer.findOne
        .catch(err => {
            return res.json("No data for id: " + err.stringValue)
        })

});
// router GET /api/personal_trainer/:id

// @route  PUT api/edit_personal_trainer/:id
// @desc   Update personal trainer profile data
// @access Private access for either personal trainer
router.put('/edit_personal_trainer/:id', passport.authenticate('pt_rule', {session: false}), (req, res) => {
    // Set up validation checking for every field that has been posted
    const ptId = req.params.id;

    let updatePt = {};
    // Enter data into updateClient only if the value of req.body is not undefined or an empty string
    for (let value in req.body) {
        if (req.body[value] !== '' && req.body[value] !== undefined) {
            // Capitalise first name if not alread done
            if (req.body.FullName) {
                req.body.FullName = capitaliseFirstLetter(req.body.FullName);
            }
            updatePt[value] = req.body[value];
        }
    } // for value in req.body

    const {errors, isValid} = validateEditClientInput(updatePt);

    // Check validation (so if it isn't valid give 400 error and message of error, status(400) makes sure the response is caught and not successful for authenticationAction editClientData
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // If it exists as the for loop above checked if password was null or undefined, hash the password and update client profile if password doesn't exist update profile without hashing non existent password
    if (updatePt.Password) {

        // This can be done synchronously via bcrypt.genSaltSync and bcrypt.hashSync, but for better performance async is used so the
        // encrypting of users passwords does not tie up the node.js thread.
        bcrypt.genSalt(12, (err, salt) => {
            bcrypt.hash(updatePt.Password, salt, (err, hash) => {
                if (err) throw err;
                // Set plain Password to the hash that was created for the Password
                updatePt.Password = hash;
                // TODO::
                // Update password in client database
                PersonalTrainer.findByIdAndUpdate(ptId, updatePt, {new: true})
                    .then(result => {
                        return res.json(result)
                    })
                    .catch(err => {
                        return res.json(err)
                    });
            })
        })
    }
    else {
        // Find client by id
        PersonalTrainer.findByIdAndUpdate(ptId, updatePt, {new: true})
            .then(client => {
                if (client) {
                    return res.json(client)
                }
            })
            .catch(err => {
                return res.json(err)
            });
    }

}); // PUT /edit_personal_trainer/:id

// @route  POST api/:id/client_progression/:cid
// @desc   Add client progression data to db
// @access private for PT's - clients can't post to the progression db collection
router.post('/:id/client_progression/:cid', passport.authenticate('pt_rule', {session: false}), (req, res) => {
    let data = req.body;

    // Check to make sure exerciseName is string and that maxWeight is number 0-999
    const {errors, isValid} = validateNewProgressInput(data);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Get clientId from frontEnd
    let ptId = req.params.id;
    let clientId = req.params.cid;

    // Verify that client exists and that personal trainer id is linked to client
    Client.findOne({_id: clientId})
        .then(resultClient => {
            // If client is found
            if (resultClient) {

                // Check to see if ptId is allowed
                if (resultClient.ptId === ptId) {

                    // Check to see if a client progression document exists (if (result) means it exists so update, else creates new exercise as it doesn't exist
                    ClientProgression.findOne({$and: [{clientId: clientId}, {exerciseName: data.exerciseName}]})
                        .then(result => {
                            if (result) {
                                // Client progress exists for exercise so insert new metrics for document (update), but only if metrics for date are new.
                                //console.log(result);
                                // Create newMetrics object which is populated with metrics sent by user, and push into document if not already present!
                                let newMetrics = {
                                    maxWeight: data.metrics.maxWeight,
                                    Date: new Date(data.metrics.Date)
                                    // Had to convert time into same format used by the database ie from '01-08-2019' to '2019-01-06T00:00:00.000Z'
                                    // It is also used with getTime() below for comparison of duplicates

                                }
                                // Array of current metrics in document
                                let documentMetrics = result.metrics;

                                // Initialise duplicate date check boolean to false
                                let metricDuplicate = false;

                                documentMetrics.map(elements => {
                                    if (elements.Date.getTime() === newMetrics.Date.getTime()) { // Had to use getTime() for comparison of date
                                        metricDuplicate = true;
                                    }
                                });

                                // If metricDuplicate is false then insert new metrics else return message stating duplication
                                if (!metricDuplicate) {
                                    // Update metrics of this document using its unique id (_id), pushing in new metric data with the $push operator.
                                    ClientProgression.update({_id: result._id}, {$push: {metrics: newMetrics}}, {safe: true})
                                        .then(update => {
                                            return res.json(update);
                                        })
                                        .catch(err => {
                                            return res.status(400).json(err);
                                        });
                                }
                                else {
                                    return res.status(400).json({Date: "Date duplication found for exercise!"})
                                }

                            }
                            else {
                                // Client progress doesn't exist for exercise so create one
                                let newMetrics = {
                                    maxWeight: data.metrics.maxWeight,
                                    Date: new Date(data.metrics.Date)
                                    // Had to convert time into same format used by the database ie from '01-08-2019' to '2019-01-06T00:00:00.000Z'
                                    // It is also used with getTime() below for comparison of duplicates

                                }

                                const newProgression = new ClientProgression({
                                    clientId: clientId,
                                    ptId: ptId,
                                    exerciseName: data.exerciseName,
                                    metrics: newMetrics
                                }); // newProgression

                                // Save newProgression to ClientProgression collection
                                newProgression.save()
                                    .then(() => {
                                        // Send back response expected in authenticatedActions for newClientProgress action
                                        let data = {n: 1, nModified: 1}
                                        return res.status(200).json(data);
                                    })
                                    .catch(err => {
                                        return res.status(400).json(err);
                                    });
                            }
                        })
                        .catch(err => {
                            console.log(err)
                            return res.status(400).json(err)
                        });

                }
                else {
                    return res.status(400).json({err: "Personal Trainer not authorised to access Progression"});
                }
            }
        })
        .catch(() => {
            return res.status(400).json({err: "Client not found!"})
        }); // Client.findOne()

}); // router post /client_progression

// @route  get api/:id/client_progression/:cid
// @desc   Retrieve client progression data from db
// @access private for PT's - clients can't get to the progression db collection
router.get('/:id/client_progression/:cid', passport.authenticate('both_rule', {session: false}), (req, res) => {

    // Get clientId from url
    let clientId = req.params.cid;
    // Get usertId from url which is used to make sure that they are allowed to access data
    let userId = req.params.id;
    // Initialise to true, if userId is same as clientId set to false (for check if user (pt) is allowed to access data
    let isPt = true;

    // Check to see if user is pt, if not set isPt to false
    if (userId === clientId){
        isPt = false;
    }

    // Verify that client exists and that personal trainer id is linked to client
    Client.findOne({_id: clientId})
        .then(result => {
            // If client is found
            if (result) {

                // Check to see if ptId is allowed, (if isPt is false - is client then allow access)
                if (result.ptId === userId || !isPt) {

                    // '-_id exerciseName metrics.maxWeight metrics.Date' part allows only exerciseName and metrics to be returned,
                    // as _id is returned by default use the minus sign with it to explicitly ignore it ie '-_id'
                    ClientProgression.find({clientId: clientId}, '-_id exerciseName metrics.maxWeight metrics.Date')
                        .then(result => {
                            if (result) {
                                return res.json(result);
                            }
                        })
                        .catch(err => {
                                return res.json(err);
                            }
                        ); // router get client progression

                }
                else {
                    return res.json({err: "User not authorised to access Progression"});
                }
            }
        })
        .catch(() => {
            // Return an empty object
            return res.json({});
        }); // Client.findOne()

}); // router get /:id/client_progression/:cid


// @route  delete api/:id/client_progression/:cid
// @desc   delete client progression exercise from db
// @access private for PT's - clients can't delete progression data for exercises in db collection
router.delete('/:id/client_progression/:cid', passport.authenticate('pt_rule', {session: false}), (req, res) =>{

    let userId = req.params.id;
    let clientId = req.params.cid;
    let data = req.body;
    console.log(data.exerciseName)

    // Check to see if client exists

    Client.findOne({_id: clientId})
        .then(result => {
            if(result) {

                // As pt's are the only ones that can access this route, check to see if uid given matches the ptId for this client
                if(result.ptId === userId){

                    // res.status(200).json({userId, clientId, data, result});

                    // Remove exercise for client
                    ClientProgression.remove({$and: [{clientId: clientId}, {exerciseName: data.exerciseName}]})
                        .then(result => {

                            // Successful removal returns n:1, unsuccessful returns n:0
                            if(result.n === 1){
                                // This returns n:1, ok:1 which will be used on client to show appropriate message
                                res.status(200).json(result);
                            }
                            else{
                                res.status(400).json({msg: "Could not find and delete exercise."});
                            }

                            }
                        )
                        .catch(() => {
                            res.status(400).json({msg: "Could not delete this exercise."})
                        })

                }
                else{
                    // Respond with a forbidden status code as the uid given is not allowed to access this data
                    res.status(403).json({msg : "User not allowed to access data."})
                }
            }
        })
        .catch(() => {
            res.status(400).json({msg: "Client not found!"});
        })

}); // router delete /:id/client_progression/:cid

//Export router so it can work with the main restful api server
    module.exports = router;
