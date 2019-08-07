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
