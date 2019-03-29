import React from 'react';

/**
 * @return {null}
 */
 function SuccessOrError (props) {

    // Only two options (true and false) with default being null
    const msg = props.msg;
    console.log(msg);
    if (msg === "Client profile has been updated.") {
        return  <div className="text-success"> {msg} </div>
    }
    if (msg === "No data has been modified!") {
        return  <div className="text-danger"> {msg} </div>
    }
    return null;
};

export default SuccessOrError;
