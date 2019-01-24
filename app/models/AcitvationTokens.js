const mongoose = require('mongoose');

// Create Schema
const ActivationTokensSchema = mongoose.Schema({
    Email: {
        type: String, require: true,
    },
    TokenData: {
        // Has Token, and ExpirationDate as fields

    }
}, {collection: "ActivationTokens"}, {timestamps: true});


module.exports = mongoose.model('ActivationTokens', ActivationTokensSchema);