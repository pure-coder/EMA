const mongoose = require('mongoose');

// Create Schema
const ClientSchema = mongoose.Schema({
    FullName: {
        // Trim
        type: String,index: true, trim: true
    },
    Email: {
        // Trim and lowercase
        type: String, index: { unique: true }, lowercase: true, trim: true,
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
        type: String, default: 'NA', trim: true,
    },
    ProfilePicUrl: {
        type: String, default: 'NA', trim: true,
    },
    Activated: {
        type: Boolean, default: false
    }
},{collection: "Clients"}, { timestamps: true });


module.exports = mongoose.model('Client', ClientSchema);