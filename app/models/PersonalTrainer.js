const mongoose = require('mongoose');

// Create Schema
const PersonalTrainerSchema = mongoose.Schema({
    FullName: {
        // Trim
        type: String, index: true, trim: true
    },
    Email: {
        // Trim and lowercase
        type: String,  index: { unique: true }, lowercase: true, trim: true,
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
    ClientIDs: [{
        type: String
    }],
    // collection value is the name of the collection that is stored in the database
},{collection: "Personal_Trainers"}, { timestamps: true });


module.exports = mongoose.model('PersonalTrainer', PersonalTrainerSchema);