const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateRegistrationInput(data) {
    let errors = {};

    // Check to see if value is not undefined as Validator functions only works on strings (otherwise throws error)

    if (data.FullName !== undefined){
        // FullName is name of field used to collect name of user (not name)
        if (!Validator.isLength(data.FullName, {min: 5, max: 25})) {
            errors.FullName = 'Full Name must be between 5 and 25 characters';
        }
    }

    if (data.Email !== undefined) {
        // Checks to see if Email field input is in a valid email format
        if (!Validator.isEmail(data.Email)) {
            errors.Email = 'Not a valid Email address';
        }
    }

    // Check that D.O.B is in past
    let now = new Date();
    if(new Date(data.DateOfBirth) > now){
        errors.DateOfBirth = 'Date of Birth must be in the past!';
    }

    if (data.ContactNumber !== undefined){
        // ContactNumber must be number
        if (!Validator.isMobilePhone(data.ContactNumber, 'any' )) {
            errors.ContactNumber = 'Must be a valid Phone Number';
        }
        if (!Validator.isLength(data.ContactNumber, {min: 11, max: 11})) {
            errors.ContactNumber = 'Contact Number must be 11 characters';
        }
    }

    if (data.Password !== undefined){
        // Password must have length with min 8 and max 20
        if (!Validator.isLength(data.Password, {min: 8, max: 20})) {
            errors.Password = 'Password must be between 8 and 20 characters';
        }
    }

    return {
        errors,
        isValid: isEmpty(errors) // Check to see if errors is empty
    }
};
