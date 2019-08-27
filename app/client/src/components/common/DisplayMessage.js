import React from 'react';

/**
 * @return {null}
 */
 function DisplayMessage ({message}) {

    // Only two options (true and false) with default being null

    // If displays this message it is an error so add error as type.
    if(message.msg === 'Date duplication found for measurement!'){
        message.type = "ERROR";
    }

    if (message.type === "SUCCESS") {
        return  <div className="text-success mb-2" id="display-message"> {message.msg} </div>
    }
    if (message.type === "ERROR") {
        return  <div className="text-danger mb-2" id="display-message"> {message.msg} </div>
    }
    return <div id="display-message" className="mb-2"></div>;
}

export default DisplayMessage;
