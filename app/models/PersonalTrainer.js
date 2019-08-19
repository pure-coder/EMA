const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PersonalTrainerSchema = new Schema({
    FullName: {
        // Trim
        type: String, trim: true
    },
    Email: {
        // Trim and lowercase
        type: String, index: true, lowercase: true, trim: true,
    },
    DateOfBirth: {
        type: Date, default : Date.now
    },
    Password: {
        type: String, trim: true,
    },
    ContactNumber: {
        type: String, trim: true,
    },
    Sex: {
        type: String, required: false, default: null, trim: true,
    },
    ProfilePicUrl: {
        type: String, default: null, trim: true,
    },
    Date: {
        type: Date
    }
    ,
    ClientIDs: [
        { type: Schema.Types.ObjectId, ref: 'Clients'}
    ]
    // collection value is the name of the collection that is stored in the database
}, {collection: "PersonalTrainers"}, {timestamps: true});

const PersonalTrainer = mongoose.model('PersonalTrainers', PersonalTrainerSchema);

module.exports = PersonalTrainer;
