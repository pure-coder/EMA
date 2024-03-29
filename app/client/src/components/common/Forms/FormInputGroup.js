import React from 'react'
import classnames from 'classnames';
import PropTypes from 'prop-types';

// Input all properties as parameters
const FormInputGroup = ({
    myClassName,
    name,
    placeholder,
    id,
    value,
    type,
    onChange,
    onClick,
    onBlur,
    error
}) => {
    return (
        <div className={"form-group " + myClassName}>
            <input type={type}
                // Using classnames package to display errors to user if they occur
                // 1st parameter are default classes that should always be used, the 2nd
                // parameter adds 'is-invalid' if errors.FullName exists
                   className={classnames(`form-control form-control-lg` , {'is-invalid': error})}
                   placeholder={placeholder}
                   id={id}
                   name={name}
                   onClick={onClick}
                   value={value}
                   onChange={onChange}
                   onBlur={onBlur}
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
    onChange: PropTypes.func.isRequired
};

FormInputGroup.defaultProps = {
    type: 'text'
};

export default FormInputGroup;
