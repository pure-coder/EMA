const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const EventsSchema = new Schema({
    text: {
        type: String, require: true,
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    id: {
        type: String
    },
    clientId: {
        type: String
    }
}, {collection: "Events"}, {timestamps: true});


const Events = mongoose.model('Events', EventsSchema);

module.exports = Events;
