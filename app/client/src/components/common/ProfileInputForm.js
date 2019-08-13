import React from 'react';
import isEmpty from "../../validation/is_empty";
import PropTypes from "prop-types";

const ProfileInputForm = ({
    onSubmit,
    onChange,
    value,
    label,
    name,
    success,
    fieldUpdated,
    errors,
    ptCheck,
    rows,
    cols
    }) =>{
    return (
        <form className="form-group Profile_notes-forms" name={name} onSubmit={onSubmit}>
            <label className="control-label form-control-lg label-profile">
                {label}
            </label>
            {/*// Indicate successfull update*/}
            {
                !isEmpty({success}) && fieldUpdated === name  && success.type === "PROFILE" &&
                (<p className="text-success profile-success">{success.msg}</p>)
            }
            {/*// Indicate unsuccessfull update*/}
            {
                !isEmpty({errors}) && fieldUpdated === name  &&
                (<p className="text-danger profile-error">{errors.msg}</p>)
            }
            <textarea
                readOnly={!ptCheck}
                name={name}
                value={value}
                onChange={onChange}
                className="form-control form-control-lg"
                rows={rows}
                cols={cols}>
            </textarea>
            {
                ptCheck ? <input type="submit" value="Update" className="btn btn-info btn-block mt-1 profile_notes"/> :
                null
            }
        </form>
    )
};

ProfileInputForm.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    errors: PropTypes.object,
    success: PropTypes.object,
    fieldUpdated: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    ptCheck: PropTypes.bool,
    rows: PropTypes.string.isRequired,
    cols: PropTypes.string.isRequired
};

export default ProfileInputForm;
