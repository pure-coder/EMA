import React from 'react'
import classnames from 'classnames';
import PropTypes from 'prop-types';

// Input all properties as parameters
const FormSelectComp = ({
                            myClassName,
                            name,
                            id,
                            values,
                            onChange,
                            error
                        }) => {

    const selectValues = values.map(value => {
        return (
            <option key={value} value={value}>{value}</option>
        )
    });

    return (
        <div className={"form-group " + myClassName}>
            <select name={name}
                   className={classnames(`form-control form-control-lg`, {'is-invalid': error})}
                   id={id}
                    onChange={onChange}
            >
                <option value="">Please select</option>
                {selectValues}
            </select>


            {/* This adds the feedback to the user (which was defined in*/}
            {/*  validation/registration.js on the API server*/}
            {error ? (<div className="invalid-feedback">{error}</div>) : (<div className="feedback"></div>)}
        </div>
    )
};

FormSelectComp.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    error: PropTypes.string,
    onChange: PropTypes.func.isRequired
};

FormSelectComp.defaultProps = {
    type: 'text'
};

export default FormSelectComp;
