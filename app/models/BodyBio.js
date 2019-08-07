const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const BodyBioSchema = new Schema({
    clientId: {
        type: String, require: true
    },
    ptId: {
        type: String, require: true,
    },
    goals : {
        type: String
    },
    injuries : {
        type: String
    },
    notes : {
        type: String
    },
    bodyMetrics: [
        {
            bodyPart: {type: String, require: true},
            measurement: {type: Number, require: true},
            Date : {type: Date, require: true}
        }
    ]
}, {collection: "BodyBio"}, {timestamps: true});

const BodyBio = mongoose.model('BodyBio', BodyBioSchema);

module.exports = BodyBio;
