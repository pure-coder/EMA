const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateRegistrationInput(data){
    let errors = {};

    // FullName is name of field used to collect name of user (not name)
    if(!Validator.isLength(data.FullName, {min: 5, max: 25})){

        errors.name = 'Full name must be between 5 and 25 characters';
    }

    return {
        errors,
        isValid: isEmpty(errors) // Check to see if errors is empty
    }
}