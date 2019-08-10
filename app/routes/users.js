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

// For creating Body bio for clients that didn't get initialised with one.
// function createBio(pId, cId, res){
//
//     // Add default body bio for client
//     const newBio = new BodyBio({
//         clientId: cId,
//         ptId: pId,
//         bodyMetrics: []
//     });
//
//     newBio.save()
//         .then(() =>{
//             // console.log(bioResult)
//             res.status(200).json();
//         })
//         .catch(() => {
//             // console.log(err)
//             res.status(400).json();
//         });
// }

// @route  GET api/pt_clients/:ptid
// @desc   Get up to date clients of personal trainer
// @access Private for PT's
router.get('/pt_clients/:ptId', passport.authenticate('pt_rule', {session: false}, null), (req, res) => {
    let ptId = req.params.ptId;
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
// @desc   Delete client, delete them from pt ClientIDs, Events and Event progression
// @access Private for PT's
router.delete('/delete_client/:cid', passport.authenticate('pt_rule', {session: false}, null), (req, res) => {

    let clientId = req.params.cid;
    // Delete the client
    Client.findOne({_id: clientId})
        .then(client => {
            if (client) {
                // Had to change $unset to $pull
                PersonalTrainer.update({_id: client.ptId}, {$pull: {ClientIDs: client.id}})
                    .then(pt => {
                        if (pt) {
                            Client.remove({_id: clientId}).remove()
                                .then(result => {
                                    if (result) {
                                        ClientProgression.remove({clientId: clientId})
                                            .then(() => {
                                                    // res.status(200).json("Client deleted successfully")
                                                }
                                            )
                                            .catch(() => {
                                                // console.log("error deleting client progress")
                                            });
                                        Events.remove({clientId: clientId})
                                            .then(() => {
                                                    // res.status(200).json("Client deleted successfully")
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
                                        return res.status(400).json({error: "Could not delete client."})
                                    }
                                })
                                // Client.remove
                                .catch(err => {
                                    return res.status(400).json(err)
                                })
                        }
                        else {
                            return res.status(400).json({error: "Could not update personal trainer documents whilst deleting client."})
                        }
                    })
                    // PersonalTrainer.update
                    .catch(err => {
                        return res.status(400).json(err)
                    })
            }
            else {
                return res.status(400).json({error: "Client does not exist."})
            }
        }
        ) // then Client.findOne
        .catch(err => {
            return res.json({err})
        })

}); // router post /delete_client

// @route  GET api/client/:cid
// @desc   Get client data
// @access Private for PT's and client
router.get('/client/:cid', passport.authenticate('both_rule', {session: false}, null), (req, res) => {
    let cid = req.params.cid;
    // get client data
    Client.findOne({_id: cid})
        .then(client => {
                if (client) {
                    let data = {};
                    data._id = client._id;
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
                    return res.status(404).json({error: `Client with id: ${cid} does not exist.`})
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
router.put('/edit_client/:cid', passport.authenticate('both_rule', {session: false}, null), (req, res) => {
    // Set up validation checking for every field that has been posted
    const clientId = req.params.cid;
    const data = req.body;

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
        return res.status(400).json({error : "No data sent to server!"})
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
                // Update password in client database
                Client.findByIdAndUpdate(clientId, updateClient, {new: true})
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
        Client.findByIdAndUpdate(clientId, updateClient, {new: true})
            .then(client => {
                if (client) {
                    return res.status(200).json(client);
                }
                return res.status(400).json({error: "Client does not exist!"});
            })
            .catch(err => {
                return res.status(400).json(err)
            });
    }
}); // PUT /edit_client/:id

// @route  GET api/personal_trainer/:id
// @desc   Get personal trainer data
// @access Private for PT's and client
router.get('/personal_trainer/:id', passport.authenticate('pt_rule', {session: false}, null), (req, res) => {
    let id = req.params.id;
    // get client data
    PersonalTrainer.findOne({_id: id})
        .then(pt => {
                if (pt) {
                    let data = {};
                    data._id = pt._id;
                    data.FullName = pt.FullName;
                    data.Email = pt.Email;
                    data.DateOfBirth = pt.DateOfBirth;
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
router.put('/edit_personal_trainer/:id', passport.authenticate('pt_rule', {session: false}, null), (req, res) => {
    // Set up validation checking for every field that has been posted
    const ptId = req.params.id;
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
        return res.status(400).json({error : "No data sent to server!"})
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
                PersonalTrainer.findByIdAndUpdate(ptId, updatePt, {new: true})
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
        PersonalTrainer.findByIdAndUpdate(ptId, updatePt, {new: true})
            .then(pt => {
                if (pt) {
                    return res.status(200).json(pt);
                }
                return res.status(400).json({error: "Personal Trainer does not exist!"});
            })
            .catch(err => {
                return res.status(400).json(err)
            });
    }
}); // PUT /edit_personal_trainer/:id

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
                    return res.status(400).json({err: "Personal Trainer not authorised to access Progression"});
                }
            }
        })
        .catch(() => {
            return res.status(400).json({err: "Client not found!"})
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
            return res.json({});
        }); // Client.findOne()

}); // router get /:id/client_progression/:cid


// @route  DELETE api/:id/client_progression/:cid
// @desc   Delete client progression exercise from db
// @access Private for PT's - clients can't delete progression data for exercises in db collection
router.delete('/:id/client_progression/:cid', passport.authenticate('pt_rule', {session: false}, null), (req, res) =>{

    let userId = req.params.id;
    let clientId = req.params.cid;
    let data = req.body;

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

// @route  PUT api/:id/client_progression/:cid
// @desc   update client progression exercise from db
// @access Private for PT's - clients can't update progression data for exercises in db collection
router.put('/:id/client_progression/:cid', passport.authenticate('pt_rule', {session: false}, null), (req, res) =>{

    let userId = req.params.id;
    let clientId = req.params.cid;
    let data = req.body.data.newMetrics;
    let exerciseId = req.body.data.exerciseId;

    // Check to see if client exists
    Client.findOne({_id: clientId})
        .then(result => {
            if(result) {

                // As pt's are the only ones that can access this route, check to see if uid given matches the ptId for this client
                if(result.ptId === userId){

                    // res.status(200).json({userId, clientId, data, result});

                    // update exercise for client
                    ClientProgression.findOneAndUpdate(
                        {_id: exerciseId},
                        {$set:
                            {
                            metrics : data
                            }
                        },
                    )
                        .then(() => {
                            res.status(200).json({msg: "Client Data successfully modified."})
                            }
                        )
                        .catch(() => {
                            res.status(400).json({msg: "Could not update this exercise."})
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
    // end of Client.findOne

    // Send something back to browser if commented out Client.findOne
    // res.send(null)

}); // router put /:id/client_progression/:cid

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
                                            return res.json(update);
                                        })
                                        .catch(err => {
                                            return res.status(400).json(err);
                                        });
                                }
                                else {
                                    return res.status(400).json({Date: "Date duplication found for measurement!"})
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
                    return res.status(400).json({err: "Personal Trainer not authorised to access BodyBio"});
                }
            }
        })
        .catch(() => {
            return res.status(400).json({err: "Client not found!"})
        }); // Client.findOne()

}); // router post /body_bio

// @route  GET api/body_bio/:cid
// @desc   Retrieve body bio data from db
// @access Available for both authorised Pt's and clients
router.get('/body_bio/:cid', passport.authenticate('both_rule', {session: false}), (req, res) => {
    // Get clientId from url
    let clientId = req.params.cid;
    // Get usertId from url which is used to make sure that they are allowed to access data
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
            return res.json({});
        }); // Client.findOne()

}); // router get /body_bio/:cid


// @route  DELETE api/:id/client_progression/:cid
// @desc   Delete client progression exercise from db
// @access Private for PT's - clients can't delete progression data for exercises in db collection
router.delete('/:id/client_progression/:cid', passport.authenticate('pt_rule', {session: false}, null), (req, res) =>{

    let userId = req.params.id;
    let clientId = req.params.cid;
    let data = req.body;

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

// @route  PUT api/:id/client_progression/:cid
// @desc   update client progression exercise from db
// @access Private for PT's - clients can't update progression data for exercises in db collection
router.put('/:id/client_progression/:cid', passport.authenticate('pt_rule', {session: false}, null), (req, res) =>{

    let userId = req.params.id;
    let clientId = req.params.cid;
    let data = req.body.data.newMetrics;
    let exerciseId = req.body.data.exerciseId;

    // Check to see if client exists
    Client.findOne({_id: clientId})
        .then(result => {
            if(result) {

                // As pt's are the only ones that can access this route, check to see if uid given matches the ptId for this client
                if(result.ptId === userId){

                    // res.status(200).json({userId, clientId, data, result});

                    // update exercise for client
                    ClientProgression.findOneAndUpdate(
                        {_id: exerciseId},
                        {$set:
                                {
                                    metrics : data
                                }
                        },
                    )
                        .then(() => {
                                res.status(200).json({msg: "Client Data successfully modified."})
                            }
                        )
                        .catch(() => {
                            res.status(400).json({msg: "Could not update this exercise."})
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
    // end of Client.findOne

    // Send something back to browser if commented out Client.findOne
    // res.send(null)

}); // router put /:id/client_progression/:cid

// @route  GET api/:id/profile_notes/:cid
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
            return res.json({});
        }); // Client.findOne()

}); // router get /:id/profile_notes/:cid

// @route  PUT api/:id/client_progression/:cid
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
        res.status(400).json({msg: "No data supplied for update"});
    }
    if(!ptStatus){
        res.status(400).json({msg: "You do not have the authorisation to update this data!"})
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
                                res.status(200).json({msg: "Data successfully updated"})
                            }
                        })
                        .catch(() => {
                            res.status(400).json({msg: "Could not update data"})
                        })

                    //res.status(200).json()

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
    // end of Client.findOne
    // res.status(200).json("check");

}); // router put /:id/profile_notes/:cid


//Export router so it can work with the main restful api server
    module.exports = router;
