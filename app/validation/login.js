const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateRegistrationInput(data){
    let errors = {};

    // As the validator module test's strings, we need to use own isEmpty function to see if it is empty if it is then
    // the field is turned into an empty string for the validation check below
    data.Email = !isEmpty(data.Email) ? data.Email : '';
    data.Password = !isEmpty(data.Password) ? data.Password : '';

    // Checks to see if Email field input is in a valid email format
    if(!Validator.isEmail(data.Email)){
        errors.Email = 'Not a valid Email address';
    }

    // Checks to see if Email field is empty using validator module
    if(Validator.isEmpty(data.Email)){
        errors.Email = 'Email is required';
    }

    // Password must have length with min 8 and max 20
    if(!Validator.isLength(data.Password, {min: 8, max: 20})) {
        errors.Password = 'Password must be between 8 and 20 characters';
    }

    // Checks to see if Password field is empty using validator module
    if(Validator.isEmpty(data.Password)){
        errors.Password = 'Password is required';
    }

    return {
        errors,
        isValid: isEmpty(errors) // Check to see if errors is empty
    }
}