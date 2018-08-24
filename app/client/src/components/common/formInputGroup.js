import React from 'react'
import classnames from 'classnames';
import PropTypes from 'prop-types';

// Input all properties as parameters
const formInputGroup = ({
    name,
    placeholder,
    value,
    error,
    type,
    onChange
}) => {
    return (
        <div className="form-group">
            <input type={type}
                // Using classnames package to display errors to user if they occur
                // 1st parameter are default classes that should always be used, the 2nd
                // parameter adds 'is-invalid' if errors.FullName exists
                   className={classnames('form-control form-control-lg', {'is-invalid': error})}
                   placeholder={placeholder}
                   name={name}
                   value={value}
                   disabled={disabled}
                   onChange={onChange}
            />
            {/* This adds the feedback to the user (which was defined in*/}
            {/*  validation/registration.js on the API server*/}
            {error && (<div className="invalid-feedback">
                {error}
            </div>)}
        </div>
    )
}

formInputGroup.PropTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    error: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.string.isRequired,
}

export default formInputGroup;