const mongoose = require('mongoose');

// Create Schema
const progressionSchema = mongoose.Schema({
    clientId: {
        type: String, required: true,
    },
    ptId: {
        type: String, require: true,
    },
    exerciseName : {
        type: String, require: true,
    },
    metrics: [
        {
            maxWeight : {type: String, require: true},
            Date : {type: Date, require: true}
        }
    ]
}, {collection: "Client_progression"}, {timestamps: true});


module.exports = mongoose.model('Client_progression', progressionSchema);
