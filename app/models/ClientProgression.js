const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const progressionSchema = new Schema({
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
}, {collection: "ClientProgression"}, {timestamps: true});


const ClientProgression = mongoose.model('ClientProgression', progressionSchema);

module.exports = ClientProgression;
