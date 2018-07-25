const mongoose = require('mongoose');

// Create Schema
const PersonalTrainerSchema = mongoose.Schema({
    FullName: {
        // Trim
        type: String, require: true, index: true, trim: true
    },
    Email: {
        // Trim and lowercase
        type: String, required: true, index: { unique: true }, lowercase: true, trim: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    DateOfBirth: {
    type: Date, required: true, trim: true,
    },
    Password: {
        type: String, required: true, trim: true,
    },
    ContactNumber: {
        type: String, required: true, trim: true,
    },
    Sex: {
        type: String, required: false, default: 'NA', trim: true,
    },
    ProfilePicUrl: {
        type: String, required: false, default: 'NA', trim: true,
    },
    ClientIDs: [{
        type: String
    }],
},{collection: "Personal_Trainers"}, { timestamps: true });


module.exports = mongoose.model('PersonalTrainer', PersonalTrainerSchema);