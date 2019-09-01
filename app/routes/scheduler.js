const express = require('express');
// set router so routes can be used
const router = express.Router();
// Require PersonalTrainer model
const PersonalTrainer = require('../models/PersonalTrainer');
// Require events
const Events = require('../models/Events');

const Clients = require('../models/Clients');
// require jason web tokens
const jwt = require('jsonwebtoken');
// jwt keys
const keys = require('../config/prod_config');
// require passport
const passport = require('passport');

// @route  GET api/:id/scheduler/:cid?
// @desc   Workout scheduler - retrieve data from database for client
// @access private for PT's and clients
router.get('/:id/scheduler/:cid', passport.authenticate('both_rule', {session: false}, null), (req, res) => {
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
router.post('/:id/scheduler/:cid', passport.authenticate('pt_rule', {session: false}, null), (req, res) => {
    let data = req.body;
    let schedId, docId; // initialising schedule id and document id

    // Check authentication of the current user, will also be used to verify if they can access data
    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    const signedInId = payload.id;
    let clientId = req.params.cid;

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
        Events.updateOne({[thisId]: docId},
            {
                text: data.text,
                start_date: data.start_date,
                end_date: data.end_date,
                clientId: clientId,
                ptId: signedInId
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
            clientId: clientId,
            ptId: signedInId
        });
        // Save new workout to database
        newWorkout.save()
            .then(events => {
                    console.log(events);
                    return res.status(200).json(events);
                }
            )
            .catch(err => {
                return res.status(400).json(err);
            })
    }
    else if (type === "deleted") {
        // Remove the workout from the schedule that user has deleted

        Events.deleteOne({[thisId]: docId})
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


router.get(`/next_workouts`, passport.authenticate('both_rule',  {session: false}, null), (req, res) => {
    // Check authentication of the current user, will also be used to verify if they can access data
    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.decode(token, keys.secretOrKey);
    const signedInId = payload.id;
    const isPt = payload.pt;

    const todaysDate = new Date(Date.now()).toISOString();

    if(isPt){
        PersonalTrainer.findOne({"_id" : signedInId}).populate('ClientIDs')
            .then(result =>{
                if(result){
                    // Returned list of populated clients (all client details)
                    const clients = result.ClientIDs;
                    // Return ids of all clients of pt
                    const clientIds = clients.map(client => {
                        return client._id;
                    });

                    // Find events for clients from todays date, sorting date in ascending order, and limit to 7 returned docs
                    Events.find({'clientId': {$in : clientIds }})
                        .where('start_date')
                        .gte(todaysDate)
                        .sort('start_date')
                        .limit(5)
                        .then(eventResults => {

                            let nextWorkouts = [];

                            eventResults.map((event) => {
                                clients.forEach(client => {
                                    if(client._id.toString() === event.clientId){
                                        let workout = {
                                            id: event._id,
                                            start_date: event.start_date,
                                            clientName: client.FullName,
                                            clientImage: client.ProfilePicUrl,
                                        };
                                        nextWorkouts.push(workout);
                                    }
                                });
                                return null;
                            });

                            return res.status(200).json(nextWorkouts)
                        })
                        .catch(err =>{
                            return res.status(400).json(err);
                        });
                }
                else {
                    return res.status(400).json("Personal Trainer not found.");
                }
            })
            .catch(err => {
                return res.status(400).json(err);
            });
    }
    else {

        Clients.findOne({"_id": signedInId})
            .then(client => {
                if(client){
                    // Find events for clients from todays date, sorting date in ascending order, and limit to 7 returned docs
                    Events.find({'clientId': signedInId})
                        .where('start_date')
                        .gte(todaysDate)
                        .sort('start_date')
                        .limit(5)
                        .then(eventResults => {

                            let nextWorkouts = [];
                            eventResults.map((event) => {

                                        let workout = {
                                            id: event._id,
                                            start_date: event.start_date,
                                            clientName: client.FullName,
                                            clientImage: client.ProfilePicUrl,
                                        };
                                        nextWorkouts.push(workout);
                                    });

                            return res.status(200).json(nextWorkouts)
                        })
                        .catch(err =>{
                            return res.status(400).json(err);
                        });
                }
            })
            .catch(err => {
                return res.status(400).json(err);
            });
    }



});

//Export router so it can work with the main restful api server
module.exports = router;
