const mongoose = require('mongoose');

// Create Client Schema
const ClientSchema = mongoose.Schema({
    FullName: {
        // Trim
        type: String, index: true, trim: true
    },
    Email: {
        // Trim and lowercase
        type: String, index: {unique: true}, lowercase: true, trim: true,
    },
    DateOfBirth: {
        type: Date, trim: true,
    },
    Password: {
        // default password is a hash of "password" - will need to be changed by user on initial login
        type: String, default: "$2a$12$gyS3ECpQsn0RZivqKG8HK.Vv5kBtcfilMI.IlzK2xas6PcxBeEZ12", trim: true,
    },
    ContactNumber: {
        type: String, trim: true,
    },
    Sex: {
        type: String, default: 'NA', trim: true,
    },
    ProfilePicUrl: {
        type: String, default: 'NA', trim: true,
    },
    Activated: {
        type: Boolean, default: false
    },
    Date: {
        type: Date
    },
    ptId: {
        type: String
    }
});

// Create Personal Trainer Schema
const PersonalTrainerSchema = mongoose.Schema({
    FullName: {
        // Trim
        type: String, index: true, trim: true
    },
    Email: {
        // Trim and lowercase
        type: String, index: {unique: true}, lowercase: true, trim: true,
    },
    DateOfBirth: {
        type: Date, trim: true,
    },
    Password: {
        type: String, trim: true,
    },
    ContactNumber: {
        type: String, trim: true,
    },
    Sex: {
        type: String, required: false, default: 'NA', trim: true,
    },
    ProfilePicUrl: {
        type: String, required: false, default: 'NA', trim: true,
    },
    Date: {
        type: Date
    }
    ,
    ClientIDs: [
        {type: Schema.Types.ObjectId, ref: 'clients', unique: true}
        ]
    // collection value is the name of the collection that is stored in the database
}, {collection: "Personal_Trainers"}, {timestamps: true});

const Clients = mongoose.model('clients', ClientSchema);
module.exports = mongoose.model('PersonalTrainer', PersonalTrainerSchema);
