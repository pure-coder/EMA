import React from 'react';

/**
 * @return {null}
 */
 function DisplayMessage (props) {

    // Only two options (true and false) with default being null
    const message = props.message;
    if (message.type === "SUCCESS") {
        return  <div className="text-success" id="display-message"> {message.msg} </div>
    }
    if (message.type === "ERROR") {
        return  <div className="text-danger" id="display-message"> {message.msg} </div>
    }
    return null;
}

export default DisplayMessage;
