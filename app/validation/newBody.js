const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateRegistrationInput(data) {
    let errors = {};

    // Check to see if value is not undefined as Validator functions only works on strings (otherwise throws error)

    if (data.bodyPart !== undefined){
        // FullName is name of field used to collect name of user (not name)
        if (!Validator.isLength(data.bodyPart, {min: 5, max: 25})) {
            errors.bodyPart = 'Body part must be entered!';
        }
    }

    if (data.bodyMetrics.measurement !== undefined){
        if (!Validator.isInt(data.bodyMetrics.measurement, {min: 0, max: 999})) {
            errors.measurement = 'measurement should be between 0-999';
        }
    }

    if(data.metrics.Date === null){
        errors.Date = 'Must be a valid date!';
    }
    if (data.metrics.Date !== undefined && data.metrics.Date !== null){
        if (!Validator.isISO8601(data.metrics.Date)) {
            errors.Date = 'Must be a valid date!';
        }
    }

    return {
        errors,
        isValid: isEmpty(errors) // Check to see if errors is empty
    }
};
