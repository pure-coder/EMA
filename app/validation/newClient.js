const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateRegistrationInput(data){
    let errors = {};

    // As the validator module test's strings, we need to use own isEmpty function to see if it is empty if it is then
    // the field is turned into an empty string for the validation check below
    data.FullName = !isEmpty(data.FullName) ? data.FullName : '';
    data.Email = !isEmpty(data.Email) ? data.Email : '';
    // data.DateOfBirth = !isEmpty(data.DateOfBirth) ? data.DateOfBirth : '';
    // data.Password = !isEmpty(data.Password) ? data.Password : '';
    // data.Password2 = !isEmpty(data.Password2) ? data.Password2 : '';
    data.ContactNumber = !isEmpty(data.ContactNumber) ? data.ContactNumber: '';

    // FullName is name of field used to collect name of user (not name)
    if(!Validator.isLength(data.FullName, {min: 5, max: 25})){
        errors.FullName = 'Full Name must be between 5 and 25 characters';
    }

    // Checks to see if FullName field is empty using validator module
    if(Validator.isEmpty(data.FullName)){
        errors.FullName = 'Full Name is required';
    }

    // Checks to see if Email field input is in a valid email format
    if(!Validator.isEmail(data.Email)){
        errors.Email = 'Not a valid Email address';
    }

    // Checks to see if Email field is empty using validator module
    if(Validator.isEmpty(data.Email)){
        errors.Email = 'Email is required';
    }

    // Checks to see if ContactNumber field is empty using validator module
    if(Validator.isEmpty(data.ContactNumber)){
        errors.ContactNumber = 'Contact number is required';
    }

    return {
        errors,
        isValid: isEmpty(errors) // Check to see if errors is empty
    }
}