const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileNotesSchema = new Schema({
    clientId: {
        type: String, index: {unique: true}, require: true
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
    }
}, {collection: "ProfileNotes"}, {timestamps: true});

const ProfileNotes = mongoose.model('ProfileNotes', ProfileNotesSchema);

module.exports = ProfileNotes;
