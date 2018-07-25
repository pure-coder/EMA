const mongoose = require('mongoose');

// Create Schema
const progressionSchema = mongoose.Schema({
    PT_id: {
        type: String, require: true,
    },
    Client_id: {
        type: String, required: true,
    },
    // Date of exercise will be in array that is added to this object
    Exercises:{
      }
},{collection: "Client_progression"}, { timestamps: true });


module.exports = mongoose.model('Client_progression', progressionSchema);