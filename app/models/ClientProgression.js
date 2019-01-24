const mongoose = require('mongoose');

// Create Schema
const progressionSchema = mongoose.Schema({
    PT_id: {
        type: String, require: true,
    },
    Client_id: {
        type: String, required: true,
    },
    // exercises will be separate objects with progression data put in arrays in those exercise objects
    Exercises: {
        type: {}
    }
}, {collection: "Client_progression"}, {timestamps: true});


module.exports = mongoose.model('Client_progression', progressionSchema);