const mail = require('../services/emailer');
const ActivateTokens = require('../models/AcitvationTokens');

module.exports = function (Email) {
    // Create a random 88 character token
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 88; i > 0; --i) {
        token += chars[Math.round(Math.random() * (chars.length - 1))];
    }

    // Check token
    // console.log(token)

    // Create client token expiration date to expire in a week (hours in a week is 168)
    let expiration = new Date();
    expiration.setHours(expiration.getHours() + 168);
    expiration.setMinutes(expiration.getMinutes() - expiration.getTimezoneOffset());

    // Check expiration date
    // console.log(expiration);

    // Save activation token in datebase
    const TokenDetails = {
        Token: token,
        ExpirationDate: expiration
    };


    ActivateTokens.findOne({Email})
        .then(ActivateToken => {
            // Check if Client email exists and return 400 error if it does
            if (ActivateToken) {
                // Then pass errors object into returned json
                return 'Token Exists';
            }
            // Create new user if email doesn't exist
            else {
                const newToken = new ActivateTokens({
                    Email: Email,
                    TokenData: TokenDetails
                });

                let result;
                // Add token to database
                newToken.save()
                    .then(
                        // Email new client for verification.
                        mail(Email, token),
                        result = 'Token created',
                    )
                    .catch(
                        err => console.log(err),
                        result = 'Token not created'
                    );
                return result;
            } // else end
        })


};
