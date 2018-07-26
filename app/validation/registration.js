const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateRegistrationInput(data){
    let errors = {};

    // As the validator module test's strings, we need to use own isEmpty function to see if it is empty if it is then
    // the field is turned into an empty string for the validation check below
    data.FullName = !isEmpty(data.FullName) ? data.FullName : '';
    data.Email = !isEmpty(data.Email) ? data.Email : '';
    data.DateOfBirth = !isEmpty(data.DateOfBirth) ? data.DateOfBirth : '';
    data.Password = !isEmpty(data.Password) ? data.Password : '';
    data.Password2 = !isEmpty(data.Password2) ? data.Password2 : '';
    data.ContactNumber = !isEmpty(data.ContactNumber) ? data.ContactNumber: '';

    // FullName is name of field used to collect name of user (not name)
    if(!Validator.isLength(data.FullName, {min: 5, max: 25})){
        errors.name = 'Full Name must be between 5 and 25 characters';
    }

    // Checks to see if Email field input is in a valid email format
    if(!Validator.isEmail(data.Email)){
        errors.Email = 'Not a valid Email address';
    }

    // Checks to see if FullName field is empty using validator module
    if(Validator.isEmpty(data.FullName)){
        errors.FullName = 'Full Name is required';
    }

    // Checks to see if Email field is empty using validator module
    if(Validator.isEmpty(data.Email)){
        errors.Email = 'Email is required';
    }

    // Checks to see if DateOfBirth field is empty using validator module
    if(Validator.isEmpty(data.DateOfBirth)){
        errors.DateOfBirth = 'Date of Birth is required';
    }

    // Password must have length with min 8 and max 20
    if(!Validator.isLength(data.Password, {min: 8, max: 20})) {
        errors.Password = 'Password must be between 8 and 16 characters';
    }

    // Checks to see if Passwords match field is empty using validator module
    if(!Validator.equals(data.Password, data.Password2)){
        errors.Password = 'Passwords do not match';
    }

    // Checks to see if Password2 field is empty using validator module
    if(Validator.isEmpty(data.Password2)) {
        errors.Password2 = 'Confirmation password is required';
    }

    // Checks to see if Password field is empty using validator module
    if(Validator.isEmpty(data.Password)){
        errors.Password = 'Password is required';
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