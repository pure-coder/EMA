const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const BodyBioSchema = new Schema({
    clientId: {
        type: String, index: {unique: true}, require: true
    },
    ptId: {
        type: String, require: true,
    },
    bodyPart: {
        type: String, require: true
    },
    bodyMetrics: [
        {
            measurement: {type: String, require: true},
            Date : {type: Date, require: true}
        }
    ]
}, {collection: "BodyBio"}, {timestamps: true});

const BodyBio = mongoose.model('BodyBio', BodyBioSchema);

module.exports = BodyBio;
