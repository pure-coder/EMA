const express = require('express');
// set router so routes can be used
const router = express();
// require bcrypt to encrypt Password
const bcrypt = require('bcryptjs');
/* require passport*/
const passport = require('passport');
const {capitaliseFirstLetter} = require('../services/capitalise');
// require jason web tokens
const jwt = require('jsonwebtoken');
// jwt keys
const keys = require('../config/db');
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
require('es6-promise').polyfill();
require('isomorphic-fetch');

// AWS
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/AWS.json');
const s3 = new AWS.S3();



// Require Input validation for editing client profile
const validateEditClientInput = require('../validation/editClient');
const validateNewProgressInput = require('../validation/newProgress');
const validateNewBodyInput = require('../validation/newBody');

// Require isEmpty function
const isEmpty = require('../validation/is_empty');

// Require PersonalTrainer model
const PersonalTrainer = require('../models/PersonalTrainer');
const Client = require('../models/Clients');

// Require ClientProgression model
const ClientProgression = require('../models/ClientProgression');
// Require BodyBio model
const BodyBio = require('../models/BodyBio');
// Require ProfileNotes model
const ProfileNotes = require('../models/ProfileNotes');

// Require events
const Events = require('../models/Events');

// @route  GET api/pt_clients
// @desc   Get up to date clients of personal trainer
// @access Private for PT's
router.get('/pt_clients', passport.authenticate('pt_rule', {session: false}, null), (req, res) => {

    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    let signedInId = payload.id;

    // get personal trainers client list
    PersonalTrainer.findOne({_id: signedInId}).populate('ClientIDs', '-Password -Date -Activated -__v')
        .exec(function (err, personalTrainer) {
                if (err) return res.status(400).json({msg : "No data for personal trainer logged in: " + err.stringValue});

                if (personalTrainer) {
                    return res.status(200).json(personalTrainer.ClientIDs)
                }
            }
        ) // Client.findOne
});
// router get /pt_clients


// @route  DELETE api/delete_client
// @desc   Delete client, delete them from pt ClientIDs, Events and Event progression
// @access Private for PT's
router.delete('/delete_client/:cid', passport.authenticate('pt_rule', {session: false}, null), (req, res) => {

    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    let signedInId = payload.id;

    let clientId = req.params.cid;
    // Delete the client
    Client.findOne({_id: clientId})
        .then(client => {
            if (client) {

                // Check to see if signed in pt is pt associated with client
                if(client.ptId === signedInId){
                    // Had to change $unset to $pull
                    PersonalTrainer.update({_id: client.ptId}, {$pull: {ClientIDs: client.id}})
                        .then(pt => {
                            if (pt) {
                                Client.remove({_id: clientId}).remove()
                                    .then(result => {
                                        if (result) {
                                            ClientProgression.remove({clientId: clientId})
                                                .then(() => {
                                                        // return res.status(200).json("Client deleted successfully")
                                                    }
                                                )
                                                .catch(() => {
                                                    // console.log("error deleting client progress")
                                                });
                                            Events.remove({clientId: clientId})
                                                .then(() => {
                                                        // return res.status(200).json("Client deleted successfully")
                                                        // console.log( "Events deleted for user: " + client.FullName + " ", events)
                                                    }
                                                )
                                                // Events.remove
                                                .catch(() => {
                                                    // console.log("error deleting client progress")
                                                });
                                            BodyBio.remove({clientId: clientId})
                                                .then(() => {
                                                        return res.status(200).json("Client deleted successfully")
                                                        // console.log( "Events deleted for user: " + client.FullName + " ", events)
                                                    }
                                                )
                                                // Events.remove
                                                .catch(err => {
                                                    return res.status(400).json(err)
                                                });
                                            ProfileNotes.remove({clientId: clientId})
                                                .then(() => {
                                                        return res.status(200).json("Client deleted successfully")
                                                        // console.log( "Events deleted for user: " + client.FullName + " ", events)
                                                    }
                                                )
                                                // Events.remove
                                                .catch(err => {
                                                    return res.status(400).json(err)
                                                })
                                        }
                                        // console.log("Deletion of user: " + client.FullName + " ", result)
                                        else{
                                            return res.status(400).json({msg: "Could not delete client."})
                                        }
                                    })
                                    // Client.remove
                                    .catch(err => {
                                        return res.status(400).json(err)
                                    })
                            }
                            else {
                                return res.status(400).json({msg: "Could not update personal trainer documents whilst deleting client."})
                            }
                        })
                        // PersonalTrainer.update
                        .catch(err => {
                            return res.status(400).json(err)
                        })
                }// if client.ptId === signedInId
                else {
                    return res.status(400).json({msg: "Signed in PT is not granted access to delete this client."});
                }
            }
            else {
                return res.status(400).json({msg: "Client does not exist."});
            }
        }
        ) // then Client.findOne
        .catch(err => {
            return res.status(400).json({err})
        })

}); // router post /delete_client

// @route  GET api/client/:cid
// @desc   Get client data
// @access Private for PT's and client
router.get('/client/:cid', passport.authenticate('both_rule', {session: false}, null), (req, res) => {
    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    let isPt = payload.pt;
    let id;

    if(isPt){
        id = req.params.cid;
    }
    else{
        id = payload.id;
    }

    // get client data
    Client.findOne({_id: id})
        .then(client => {
                if (client) {

                    // Check access rights allowing the data to be requested
                    if(client._id.toString() === id || client.ptId ===  id){
                        let data = {};
                        data._id = client._id;
                        data.FullName = client.FullName;
                        data.DateOfBirth = client.DateOfBirth;
                        data.Email = client.Email;
                        data.ContactNumber = client.ContactNumber;
                        data.ProfilePicUrl = client.ProfilePicUrl;
                        data.Sex = client.Sex;
                        return res.status(200).json(data)
                    }
                    else{
                        return res.status(400).json({msg: "Signed in user does not have authorisation to request this data."})
                    }
                }
            }
        ) // then Client.findOne
        .catch(() => {
            return res.status(404).json({error: `Client with id: ${cid} does not exist.`})
        })

});
// router GET /client/:id

// @route  PUT /edit_client/:cid
// @desc   Update client profile data
// @access Private access for either personal trainer or client
router.put('/edit_client/:cid?', passport.authenticate('both_rule', {session: false}, null), (req, res) => {
    // Set up validation checking for every field that has been posted

    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    let isPt = payload.pt;
    let signedInId = payload.id;
    const data = req.body;
    let id;

    // Check if pt or client
    if(isPt){
        id = req.params.cid;
    }
    else {
        id = signedInId;
    }

    let updateClient = {};
    // Checked on client if empty, but make sure!!

    // Turn object into array for at least 50% performance increase of iteration (otherwise using hasOwnProperty decreases
    // performance.
    const entries = Object.entries(data);

    for (let [key ,value] of entries) {
        if (!isEmpty(value) && value !== undefined) {
            // Capitalise first name if not already done
            if (key === "FullName") {
                value = capitaliseFirstLetter(value);
            }
            updateClient[key] = value;
        }
    } // for value in req.body

    // If array isn't empty then check data given
    if(!isEmpty(updateClient)) {
        const {errors, isValid} = validateEditClientInput(updateClient);
        // Check validation (so if it isn't valid give 400 error and message of error, status(400) makes sure the response is caught and not successful for authenticationAction editClientData
        if (!isValid) {
            return res.status(400).json(errors);
        }
    }
    else{
        return res.status(400).json({msg : "No data sent to server!"})
    }

    Client.findOne({_id: id})
        .then(clientResult => {
            if (clientResult){
                if(clientResult._id.toString() === id || clientResult.ptId === signedInId){
                    // If it exists as the for loop above checked if password was null or undefined, hash the password and update client
                    // profile if password doesn't exist update profile without hashing non existent password
                    if (updateClient.Password) {

                        // This can be done synchronously via bcrypt.genSaltSync and bcrypt.hashSync, but for better performance async
                        // is used so the encrypting of users passwords does not tie up the node.js thread.
                        bcrypt.genSalt(12, (err, salt) => {
                            bcrypt.hash(updateClient.Password, salt, (err, hash) => {
                                if (err) throw err;
                                // Set plain Password to the hash that was created for the Password
                                updateClient.Password = hash;
                                // Update password in client database
                                Client.findByIdAndUpdate(id, updateClient, {new: true})
                                    .then(result => {
                                        if(result) {
                                            return res.status(200).json(result)
                                        }
                                        return res.status(404).json({err: "Client does not exist!"})
                                    })
                                    .catch(err => {
                                        return res.status(400).json(err)
                                    });
                            })
                        })
                    }
                    else {
                        // Find client by id
                        Client.findByIdAndUpdate(id, updateClient, {new: true})
                            .then(client => {
                                if (client) {
                                    return res.status(200).json(client);
                                }
                                else {
                                    return res.status(400).json({msg: "Client does not exist!"});
                                }
                            })
                            .catch(err => {
                                return res.status(400).json(err)
                            });
                    }
                }
                else{
                    return res.status(400).json({msg: "Not authorised to update data."})
                }

            }
            else{
                return res.status(400).json({msg: "Client not found"})
            }
        })
        .catch(() => {
            // console.log(err)
            return res.status(400).json();
            }
        )
}); // PUT /edit_client/:id

// @route  GET api/personal_trainer
// @desc   Get personal trainer data
// @access Private for PT's
router.get('/personal_trainer', passport.authenticate('pt_rule', {session: false}, null), (req, res) => {

    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    let signedInId = payload.id;
    // get client data
    PersonalTrainer.findOne({_id: signedInId})
        .then(pt => {
                if (pt) {
                    let data = {};
                    data._id = pt._id;
                    data.FullName = pt.FullName;
                    data.Email = pt.Email;
                    data.DateOfBirth = pt.DateOfBirth;
                    data.Sex = pt.Sex;
                    data.ProfilePicUrl = pt.ProfilePicUrl;
                    return res.status(200).json(data)
                }
                // if pt is null
                else {
                    return res.status(400).json("No data for id: " + id)
                }
            }
        ) // then PersonalTrainer.findOne
        .catch(err => {
            return res.status(400).json("No data for id: " + err.stringValue)
        })

});
// router GET /api/personal_trainer

// @route  PUT api/edit_personal_trainer
// @desc   Update personal trainer profile data
// @access Private access for personal trainer
router.put('/edit_personal_trainer', passport.authenticate('pt_rule', {session: false}, null), (req, res) => {
    // Set up validation checking for every field that has been posted
    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    let signedInId = payload.id;
    const data = req.body;

    let updatePt = {};
    // Checked on pt if empty, but make sure!!
    const entries = Object.entries(data);

    for (let [key ,value] of entries) {
        if (!isEmpty(value) && value !== undefined) {
            // Capitalise first name if not already done
            if (key === "FullName") {
                value = capitaliseFirstLetter(value);
            }
            updatePt[key] = value;
        }
    } // for value in req.body

    // If array isn't empty then check data given
    if(!isEmpty(updatePt)) {
        const {errors, isValid} = validateEditClientInput(updatePt);
        // Check validation (so if it isn't valid give 400 error and message of error, status(400) makes sure the response is caught and not successful for authenticationAction editClientData
        if (!isValid) {
            return res.status(400).json(errors);
        }
    }
    else{
        return res.status(400).json({msg : "No data sent to server!"})
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
                // Update password in client database
                PersonalTrainer.findByIdAndUpdate(signedInId, updatePt, {new: true})
                    .then(result => {
                        if(result) {
                            return res.status(200).json(result)
                        }
                        return res.status(404).json({err: "Personal Trainer does not exist!"})
                    })
                    .catch(err => {
                        return res.status(400).json(err)
                    });
            })
        })
    }
    else {
        // Find client by id
        PersonalTrainer.findByIdAndUpdate(signedInId, updatePt, {new: true})
            .then(pt => {
                if (pt) {
                    return res.status(200).json(pt);
                }
                else {
                    return res.status(400).json({msg: "Personal Trainer does not exist!"});
                }
            })
            .catch(err => {
                return res.status(400).json(err)
            });
    }
}); // PUT /edit_personal_trainer

// @route  POST api/client_progression/:cid
// @desc   Add client progression data to db
// @access Private for PT's - clients can't post to the progression db collection
router.post('/client_progression/:cid', passport.authenticate('pt_rule', {session: false}, null), (req, res) => {
    let data = req.body;

    // Check to make sure exerciseName is string and that maxWeight is number 0-999
    const {errors, isValid} = validateNewProgressInput(data);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    let signedInId = payload.id;
    let clientId = req.params.cid;

    // Verify that client exists and that personal trainer id is linked to client
    Client.findOne({_id: clientId})
        .then(resultClient => {
            // If client is found
            if (resultClient) {

                // Check to see if ptId is allowed
                if (resultClient.ptId === signedInId) {

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

                                };
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
                                            return res.status(200).json(update);
                                        })
                                        .catch(err => {
                                            return res.status(400).json(err);
                                        });
                                }
                                else {
                                    return res.status(400).json({msg: "Date duplication found for exercise!"})
                                }

                            }
                            else {
                                // Client progress doesn't exist for exercise so create one
                                let newMetrics = {
                                    maxWeight: data.metrics.maxWeight,
                                    Date: new Date(data.metrics.Date)
                                    // Had to convert time into same format used by the database ie from '01-08-2019' to '2019-01-06T00:00:00.000Z'
                                    // It is also used with getTime() below for comparison of duplicates

                                };

                                const newProgression = new ClientProgression({
                                    clientId: clientId,
                                    ptId: resultClient.ptId,
                                    exerciseName: data.exerciseName,
                                    metrics: newMetrics
                                }); // newProgression

                                // Save newProgression to ClientProgression collection
                                newProgression.save()
                                    .then(() => {
                                        // Send back response expected in authenticatedActions for newClientProgress action
                                        let data = {n: 1, nModified: 1};
                                        return res.status(200).json(data);
                                    })
                                    .catch(err => {
                                        return res.status(400).json(err);
                                    });
                            }
                        })
                        .catch(err => {
                            // console.log(err)
                            return res.status(400).json(err)
                        });

                }
                else {
                    return res.status(400).json({msg: "Personal Trainer not authorised to access Progression"});
                }
            }
        })
        .catch(() => {
            return res.status(400).json({msg: "Client not found!"})
        }); // Client.findOne()

}); // router post /client_progression

// @route  GET api/:id/client_progression/:cid
// @desc   Retrieve client progression data from db
// @access Available for both authorised Pt's and clients
router.get('/client_progression/:cid', passport.authenticate('both_rule', {session: false}), (req, res) => {
    // Get clientId from url
    let clientId = req.params.cid;
    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    let signedInId = payload.id;

    // Verify that client exists and that personal trainer id is linked to client
    Client.findOne({_id: clientId})
        .then(result => {
            // If client is found
            if (result) {

                // Check to see if signed in user is same as clientId or ptId is allowed access
                if (clientId === signedInId || result.ptId === signedInId) {

                    // '-_id exerciseName metrics.maxWeight metrics.Date' part allows only exerciseName and metrics to be returned,
                    // as _id is returned by default use the minus sign with it to explicitly ignore it ie '-_id' (deleted -_id as needed for refactoring -- creating component for each graph)
                    // CHANGE - _id needed for mapping in progression editing functionality
                    ClientProgression.find({clientId: clientId}, 'exerciseName metrics._id metrics.maxWeight metrics.Date')
                        .then(result => {
                            if (result) {
                                return res.status(200).json(result);
                            }
                            else{
                                return res.status(400).json();
                            }
                        })
                        .catch(err => {
                                return res.status(400).json(err);
                            }
                        ); // router get client progression

                }
                else {
                    // 401 Unauthorised
                    return res.status(401).json({err: "User not authorised to access Progression"});
                }
            }
            else{
                // 404 Not found
                return res.status(404).json();
            }
        })
        .catch(() => {
            // Return an empty object
            return res.status(400).json({});
        }); // Client.findOne()

}); // router get /:id/client_progression/:cid


// @route  DELETE api/client_progression/:cid
// @desc   Delete client progression exercise from db
// @access Private for PT's - clients can't delete progression data for exercises in db collection
router.delete('/client_progression/:cid', passport.authenticate('pt_rule', {session: false}, null), (req, res) =>{

    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    let signedInId = payload.id;
    let clientId = req.params.cid;
    let data = req.body;

    // Check to see if client exists

    Client.findOne({_id: clientId})
        .then(result => {
            if(result) {

                // As pt's are the only ones that can access this route, check to see if uid given matches the ptId for this client
                if(result.ptId === signedInId){

                    // return res.status(200).json({userId, clientId, data, result});

                    // Remove exercise for client
                    ClientProgression.remove({$and: [{clientId: clientId}, {exerciseName: data.exerciseName}]})
                        .then(result => {

                            // Successful removal returns n:1, unsuccessful returns n:0
                            if(result.n === 1){
                                // This returns n:1, ok:1 which will be used on client to show appropriate message
                                return res.status(200).json(result);
                            }
                            else{
                                return res.status(400).json({msg: "Could not find and delete exercise."});
                            }

                            }
                        )
                        .catch(() => {
                            return res.status(400).json({msg: "Could not delete this exercise."})
                        })

                }
                else{
                    // Respond with a forbidden status code as the uid given is not allowed to access this data
                    return res.status(403).json({msg : "User not allowed to access data."})
                }
            }
        })
        .catch(() => {
            return res.status(400).json({msg: "Client not found!"});
        })

}); // router delete /client_progression/:cid

// @route  PUT api/client_progression/:cid
// @desc   update client progression exercise from db
// @access Private for PT's - clients can't update progression data for exercises in db collection
router.put('/client_progression/:cid', passport.authenticate('pt_rule', {session: false}, null), (req, res) =>{

    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    let signedInId = payload.id;
    let clientId = req.params.cid;
    let data = req.body.data.newMetrics;
    let exerciseId = req.body.data.exerciseId;

    // Check to see if client exists
    Client.findOne({_id: clientId})
        .then(result => {
            if(result) {

                // As pt's are the only ones that can access this route, check to see if uid given matches the ptId for this client
                if(result.ptId === signedInId){

                    // return res.status(200).json({userId, clientId, data, result});

                    // update exercise for client
                    ClientProgression.findOneAndUpdate(
                        {_id: exerciseId},
                        {$set:
                            {
                            metrics : data
                            }
                        },
                    )
                        .then(result => {
                                if(result){
                                    return res.status(200).json({msg: "Client Data successfully modified."})
                                }
                                else{
                                    return res.status(400).json({msg: "Could not update exercise."})
                                }

                            }
                        )
                        .catch(() => {
                            return res.status(400).json({msg: "Could not update this exercise."})
                        })

                }
                else{
                    // Respond with a forbidden status code as the uid given is not allowed to access this data
                    return res.status(403).json({msg : "User not allowed to access data."})
                }
            }
        })
        .catch(() => {
            return res.status(400).json({msg: "Client not found!"});
        })
    // end of Client.findOne

    // Send something back to browser if commented out Client.findOne
    // res.send(null)

}); // router put /client_progression/:cid

// @route  POST api/body_bio/:cid
// @desc   Add body bio data to db
// @access Private for PT's - clients can't post to the progression db collection
router.post('/body_bio/:cid', passport.authenticate('pt_rule', {session: false}, null), (req, res) => {
    let data = req.body;

    const {errors, isValid} = validateNewBodyInput(data);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    let signedInId = payload.id;
    let clientId = req.params.cid;

    // Verify that client exists and that personal trainer id is linked to client
    Client.findOne({_id: clientId})
        .then(resultClient => {
            // If client is found
            if (resultClient) {

                // Check to see if ptId is allowed
                if (resultClient.ptId === signedInId) {

                    BodyBio.findOne({$and: [{clientId: clientId}, {bodyPart: data.bodyPart}]})
                        .then(result => {
                            if (result) {

                                let newMetrics = {
                                    measurement: data.bodyMetrics.measurement,
                                    Date: new Date(data.bodyMetrics.Date)
                                };
                                // Array of current metrics in document
                                let documentMetrics = result.bodyMetrics;

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
                                    BodyBio.update({_id: result._id}, {$push: {bodyMetrics: newMetrics}}, {safe: true})
                                        .then(update => {
                                            return res.status(200).json(update);
                                        })
                                        .catch(err => {
                                            return res.status(400).json(err);
                                        });
                                }
                                else {
                                    return res.status(400).json({msg: "Date duplication found for measurement!"})
                                }

                            }
                            else {
                                // Client progress doesn't exist for bodyPart so create one
                                let newMetrics = {
                                    measurement: data.bodyMetrics.measurement,
                                    Date: new Date(data.bodyMetrics.Date)
                                };

                                const newBodyBio = new BodyBio({
                                    clientId: clientId,
                                    ptId: resultClient.ptId,
                                    bodyPart: data.bodyPart,
                                    bodyMetrics: newMetrics
                                }); // newBody

                                // Save newBody to BodyBio
                                newBodyBio.save()
                                    .then(() => {
                                        // Send back response expected in authenticatedActions for newBodyBio action
                                        let data = {n: 1, nModified: 1};
                                        return res.status(200).json(data);
                                    })
                                    .catch(err => {
                                        return res.status(400).json(err);
                                    });
                            }
                        })
                        .catch(err => {
                            // console.log(err)
                            return res.status(400).json(err)
                        });

                }
                else {
                    return res.status(400).json({msg: "Personal Trainer not authorised to access BodyBio"});
                }
            }
        })
        .catch(() => {
            return res.status(400).json({msg: "Client not found!"})
        }); // Client.findOne()

}); // router post /body_bio

// @route  GET api/body_bio/:cid
// @desc   Retrieve body bio data from db
// @access Available for both authorised Pt's and clients
router.get('/body_bio/:cid', passport.authenticate('both_rule', {session: false}), (req, res) => {
    // Get clientId from url
    let clientId = req.params.cid;
    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    let signedInId = payload.id;

    // Verify that client exists and that personal trainer id is linked to client
    Client.findOne({_id: clientId})
        .then(result => {
            // If client is found
            if (result) {
                // Check to see if signed in user is same as clientId or ptId is allowed access
                if (clientId === signedInId || result.ptId === signedInId) {

                    // '-_id exerciseName metrics.maxWeight metrics.Date' part allows only exerciseName and metrics to be returned,
                    // as _id is returned by default use the minus sign with it to explicitly ignore it ie '-_id' (deleted -_id as needed for refactoring -- creating component for each graph)
                    // CHANGE - _id needed for mapping in progression editing functionality
                    BodyBio.find({clientId: clientId}, 'bodyPart bodyMetrics._id bodyMetrics.measurement bodyMetrics.Date')
                        .then(result => {
                            if (result) {
                                return res.status(200).json(result);
                            }
                            else{
                                return res.status(400).json();
                            }
                        })
                        .catch(err => {
                                return res.status(400).json(err);
                            }
                        ); // router get client progression

                }
                else {
                    // 401 Unauthorised
                    return res.status(401).json({err: "User not authorised to access Progression"});
                }
            }
            else{
                // 404 Not found
                return res.status(404).json();
            }
        })
        .catch(() => {
            // Return an empty object
            return res.status(400).json({});
        }); // Client.findOne()

}); // router get /body_bio/:cid


// @route  DELETE api/body_bio/:cid
// @desc   Delete body bio body part data from db
// @access Private for PT's - clients can't delete progression data for body part in db collection
router.delete('/body_bio/:cid', passport.authenticate('pt_rule', {session: false}, null), (req, res) =>{

    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    let signedInId = payload.id;
    let clientId = req.params.cid;
    let data = req.body;

    // Check to see if client exists

    Client.findOne({_id: clientId})
        .then(result => {
            if(result) {

                // As pt's are the only ones that can access this route, check to see if uid given matches the ptId for this client
                if(result.ptId === signedInId){

                    // return res.status(200).json({userId, clientId, data, result});

                    // Remove exercise for client
                    BodyBio.remove({$and: [{clientId: clientId}, {bodyPart: data.bodyPart}]})
                        .then(result => {

                                // Successful removal returns n:1, unsuccessful returns n:0
                                if(result.n === 1){
                                    // This returns n:1, ok:1 which will be used on client to show appropriate message
                                    return res.status(200).json(result);
                                }
                                else{
                                    return res.status(400).json({msg: "Could not find and delete exercise."});
                                }

                            }
                        )
                        .catch(() => {
                            return res.status(400).json({msg: "Could not delete this exercise."})
                        })

                }
                else{
                    // Respond with a forbidden status code as the uid given is not allowed to access this data
                    return res.status(403).json({msg : "User not allowed to access data."})
                }
            }
        })
        .catch(() => {
            return res.status(400).json({msg: "Client not found!"});
        })

}); // router delete /body_bio/:cid

// @route  PUT api/body_bio/:cid
// @desc   update client progression for body part from db
// @access Private for PT's - clients can't update progression data for body parts in db collection
router.put('/body_bio/:cid', passport.authenticate('pt_rule', {session: false}, null), (req, res) =>{

    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    let signedInId = payload.id;
    let clientId = req.params.cid;
    let data = req.body.data.bodyMetrics;
    let bodyPartId = req.body.data.bodyPartId;

    // Check to see if client exists
    Client.findOne({_id: clientId})
        .then(result => {
            if(result) {

                // As pt's are the only ones that can access this route, check to see if uid given matches the ptId for this client
                if(result.ptId === signedInId){

                    // return res.status(200).json({userId, clientId, data, result});

                    // update exercise for client
                    BodyBio.findOneAndUpdate(
                        {_id: bodyPartId},
                        {$set:
                                {
                                    bodyMetrics : data
                                }
                        },
                    )
                        .then(result => {
                            if(result){
                                return res.status(200).json({msg: "Client Data successfully modified."})
                            }
                            else{
                                return res.status(400).json({msg: "Could not update body part."})
                            }

                            }
                        )
                        .catch(() => {
                            return res.status(400).json({msg: "Could not update this body part."})
                        })

                }
                else{
                    // Respond with a forbidden status code as the uid given is not allowed to access this data
                    return res.status(403).json({msg : "User not allowed to access data."})
                }
            }
        })
        .catch(() => {
            return res.status(400).json({msg: "Client not found!"});
        })
    // end of Client.findOne

    // Send something back to browser if commented out Client.findOne
    // res.send(null)

}); // router put /body_bio/:cid

// @route  GET api/profile_notes/:cid
// @desc   Retrieve client profile notes data from db
// @access Available for both authorised Pt's and clients
router.get('/profile_notes/:cid', passport.authenticate('both_rule', {session: false}), (req, res) => {
    // Get clientId from url
    let clientId = req.params.cid;

    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    let signedInId = payload.id;

    // Verify that client exists and that personal trainer id is linked to client
    Client.findOne({_id: clientId})
        .then(result => {
            // If client is found
            if (result) {

                // Check to see if signed in user is same as clientId or ptId is allowed access
                if (clientId === signedInId || result.ptId === signedInId) {

                    // Only return notes, goals, and injuries (have to use -_id to stop returning of id as it is returned by default)
                    ProfileNotes.findOne({clientId: clientId}, '-_id notes goals injuries')
                        .then(result => {
                            if (result) {
                                return res.status(200).json(result);
                            }
                            else{
                                return res.status(400).json();
                            }
                        })
                        .catch(err => {
                                return res.status(400).json(err);
                            }
                        ); // router get profile notes

                }
                else {
                    // 401 Unauthorised
                    return res.status(401).json({err: "User not authorised to access profile notes"});
                }
            }
            else{
                // 404 Not found
                return res.status(404).json();
            }
        })
        .catch(() => {
            // Return an empty object
            return res.status(400).json({});
        }); // Client.findOne()

}); // router get /profile_notes/:cid

// @route  PUT api/profile_notes/:cid
// @desc   update profile notes data in db
// @access Private for PT's - clients can't update profile notes data in db collection
router.put('/profile_notes/:cid', passport.authenticate('pt_rule', {session: false}, null), (req, res) =>{

    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    let signedInId = payload.id;
    let ptStatus = payload.pt;

    let clientId = req.params.cid;
    let data = req.body.data;
    //Testing from postman
    // let data = req.query;

    if(isEmpty(data)){
        return res.status(400).json({msg: "No data supplied for update"});
    }
    if(!ptStatus){
        return res.status(400).json({msg: "You do not have the authorisation to update this data!"})
    }

    // Check to see if client exists
    Client.findOne({_id: clientId})
        .then(result => {
            if(result) {

                // As pt's are the only ones that can access this route, check to see if signed in pt is pt who has access to client data.
                if(result.ptId === signedInId){

                    // testing from postman using Params
                    const key = Object.keys(data)[0];
                    const value = Object.values(data)[0];

                    // update exercise for client
                    ProfileNotes.findOneAndUpdate(
                        {clientId},
                        {$set:
                                {
                                    [key]: value
                                }
                        },
                    )
                        .then(result => {
                            if (result) {
                                return res.status(200).json({msg: "Data successfully updated"})
                            }
                        })
                        .catch(() => {
                            return res.status(400).json({msg: "Could not update data"})
                        })

                    //return res.status(200).json()

                }
                else{
                    // Respond with a forbidden status code as the uid given is not allowed to access this data
                    return res.status(403).json({msg : "User not allowed to access data."})
                }
            }
        })
        .catch(() => {
            return res.status(400).json({msg: "Client not found!"});
        })
    // end of Client.findOne
    // return res.status(200).json("check");

}); // router put /profile_notes/:cid

// @route  POST api/upload_profile_pic
// @desc   update profile notes data in db
// @access Private for PT's and clients - PT's and clients can update their own profile picture db collection
router.post(`/upload_profile_pic`, upload.single('profileImage'),passport.authenticate('both_rule', {session: false}, null), (req, res) =>{

    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    let signedInId = payload.id;
    let isPt = payload.pt;

    let fileName = req.file.originalname;
    let imageBuffer = req.file.buffer;
    let fileType = req.file.mimetype;
    let fileSize = req.file.size;
    let key = `images/${fileName}.jpg`;

    const bucket = 'jrdunkleyfitnessapp';
    const region = AWS.config.region;

    let newUrl;

    s3.getSignedUrl('putObject', {
        Bucket: bucket,
        Key: key, //filename
        Expires: 10000, //time to expire in seconds
        ACL : 'public-read' // Use this to make resource url available to public
    }, (err, url) => {
        if(err){
            return res.status(400).json(err);
        }
        else{
            fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": fileType,
                    "Content-Length": fileSize
                },
                body: imageBuffer
            }).then(result => {
                // Upload successful, send profile pic url to db.
                if(result.status === 200){
                    newUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

                    // User is pt so update pt users profile pic
                    // Check if the user is a PT
                    if(isPt){
                        // update exercise for client
                        PersonalTrainer.findOneAndUpdate(
                            {_id: signedInId},
                            {$set: {
                                    ProfilePicUrl: newUrl
                                }
                            },
                        )
                            .then(result => {
                                if (result) {
                                    return res.status(200).json({msg: "Profile picture updated", url: newUrl})
                                }
                            })
                            .catch(() => {
                                return res.status(400).json({msg: "Not authorised to update profile picture"})
                            })
                    }
                    else {
                        Client.findOneAndUpdate(
                            {_id: signedInId},
                            {$set: {
                                    ProfilePicUrl: newUrl
                                }
                            },
                        )
                            .then(result => {
                                if (result) {
                                    return res.status(200).json({msg: "User profile image updated.", url: newUrl})
                                }
                            })
                            .catch(() => {
                                return res.status(400).json({msg: "Not authorised to update profile picture"})
                            })
                    }
                }
                else{
                    return res.status(400).json("Failed to upload profile picture");
                }
            })
            .catch(err => {
                console.log(err);
            });
        }
    });
}); // router post upload profile picture


// @route  DELETE api/delete_personal_trainer
// @desc   Delete personal trainer account and all related client accounts (along with their progression, events, etc)  from db
// @access Private for PT's - PT's can only delete their account and related clients
router.delete('/delete_personal_trainer', passport.authenticate('pt_rule', {session: false}, null), (req, res) =>{

    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    let signedInId = payload.id;

    // Check to see if personal trainer exists
    PersonalTrainer.findOne({_id: signedInId})
        .then(result => {
            if(result) {
                const clientsArray = result.ClientIDs;

                // Clients exist then remove them
                if(!isEmpty(clientsArray)){
                    // For each that removes all clients that were in clientsArray
                    Client.deleteMany({_id: {$in: clientsArray}})
                        .then(result => {
                            
                        })
                        // Client.remove
                        .catch(err => {
                            return res.status(400).json(err)
                        });
                    ClientProgression.deleteMany({clientId: {$in: clientsArray}})
                        .then(() => {
                                // return res.status(200).json("Client deleted successfully")
                            }
                        )
                        .catch(() => {
                            // console.log("error deleting client progress")
                        });
                    Events.deleteMany({clientId: {$in: clientsArray}})
                        .then(() => {
                                // return res.status(200).json("Client deleted successfully")
                                // console.log( "Events deleted for user: " + client.FullName + " ", events)
                            }
                        )
                        // Events.deleteMany
                        .catch(() => {
                            // console.log("error deleting client progress")
                        });
                    BodyBio.deleteMany({clientId: {$in: clientsArray}})
                        .then(() => {
                                // return res.status(200).json("Client deleted successfully")
                                // console.log( "Events deleted for user: " + client.FullName + " ", events)
                            }
                        )
                        // Events.deleteMany
                        .catch(err => {
                            return res.status(400).json(err)
                        });
                    ProfileNotes.deleteMany({clientId: {$in: clientsArray}})
                        .then(() => {
                                // return res.status(200).json("Client deleted successfully")
                                // console.log( "Events deleted for user: " + client.FullName + " ", events)
                            }
                        )
                        // Events.deleteMany
                        .catch(err => {
                            return res.status(400).json(err)
                        });
                }
            }
            PersonalTrainer.deleteMany({_id: signedInId})
                .then(()=>{
                    return res.status(200).json("Personal trainer deleted along with associated clients.");
                })
                .catch(()=>{
                    return res.status(400).json("Personal trainer account could not be deleted.");
                });
        })
        .catch(() => {
            return res.status(400).json({msg: "Personal trainer not found!"});
        })
}); // router delete /delete_personal_trainer

//Export router so it can work with the main restful api server
module.exports = router;
