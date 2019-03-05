const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ActivationTokensSchema = new Schema({
    Email: {
        type: String, require: true,
    },
    TokenData: {
        // Has Token, and ExpirationDate as fields

    }
}, {collection: "ActivationTokens"}, {timestamps: true});


const ActivationTokens = mongoose.model('ActivationTokens', ActivationTokensSchema);

module.exports = ActivationTokens
