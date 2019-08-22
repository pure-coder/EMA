const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateRegistrationInput(data) {
    let errors = {};

    // Check to see if value is not undefined as Validator functions only works on strings (otherwise throws error)
    //console.log(data)

    if (data.bodyPart !== undefined){
        // FullName is name of field used to collect name of user (not name)
        if (!Validator.isLength(data.bodyPart, {min: 5, max: 25})) {
            errors.bodyPart = 'Body part must be entered!';
        }
    }

    if(!isEmpty(data) && data.bodyMetrics.measurement !== undefined){
        if (!Validator.isInt(data.bodyMetrics.measurement, {min: 0, max: 999})) {
            errors.measurement = 'measurement should be between 0-999';
        }
    }
    else{
        errors.measurement = 'Measurement not entered!'
    }


    if(!isEmpty(data) && data.bodyMetrics.Date !== undefined){
        //console.log(data.bodyMetrics.Date)
        if (!Validator.isISO8601(data.bodyMetrics.Date)) {
            errors.Date = 'Must be a valid date!';
        }
    }
    else{
        errors.Date = 'Date not entered!';
    }

    return {
        errors,
        isValid: isEmpty(errors) // Check to see if errors is empty
    }
};
