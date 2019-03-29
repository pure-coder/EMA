import React from 'react';

/**
 * @return {null}
 */
 function SuccessOrError (props) {

    // Only two options (true and false) with default being null
    const isSuccess = props.isSuccess;
    if (isSuccess === true) {
        return  <div className="text-success"> {props.msg} </div>
    }
    if (isSuccess === false) {
        return  <div className="text-danger"> {props.msg} </div>
    }
    return null;
};

export default SuccessOrError;
