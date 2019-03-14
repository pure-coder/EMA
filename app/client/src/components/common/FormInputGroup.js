import React from 'react'
import classnames from 'classnames';
import PropTypes from 'prop-types';

// Input all properties as parameters
const FormInputGroup = ({
    name,
    placeholder,
    id,
    value,
    type,
    onChange,
    error
}) => {
    return (
        <div className="form-group">
            <input type={type}
                // Using classnames package to display errors to user if they occur
                // 1st parameter are default classes that should always be used, the 2nd
                // parameter adds 'is-invalid' if errors.FullName exists
                   className={classnames('form-control form-control-lg', {'is-invalid': error})}
                   placeholder={placeholder}
                   id={id}
                   name={name}
                   value={value}
                   onChange={onChange}
            />
            {/* This adds the feedback to the user (which was defined in*/}
            {/*  validation/registration.js on the API server*/}
            {error && (<div className="invalid-feedback">{error}</div>)}
        </div>
    )
};

FormInputGroup.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.string.isRequired,
    error: PropTypes.string,
    onChange: PropTypes.func.isRequired
};

FormInputGroup.defaultProps = {
    type: 'text'
};

export default FormInputGroup;
