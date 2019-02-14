const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ClientSchema = new Schema({
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
})

const Clients = mongoose.model('Client', ClientSchema);
module.exports = Clients;
