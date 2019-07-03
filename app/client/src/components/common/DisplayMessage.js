import React from 'react';

/**
 * @return {null}
 */
 function DisplayMessage (props) {

    // Only two options (true and false) with default being null
    const message = props.message;
    if (message.type === "SUCCESS") {
        return  <div className="text-success mb-2" id="display-message"> {message.msg} </div>
    }
    if (message.type === "ERROR") {
        return  <div className="text-danger mb-2" id="display-message"> {message.msg} </div>
    }
    return <div id="display-message" className="mb-2"></div>;
}

export default DisplayMessage;
