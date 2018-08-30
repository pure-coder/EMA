const mongoose = require('mongoose');

// Create Schema
const EventsSchema = mongoose.Schema({
    text: {
        type: String, require: true,
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    color: {
        type: String
    }
},{collection: "Events"}, { timestamps: true });


module.exports = mongoose.model('Events', EventsSchema);