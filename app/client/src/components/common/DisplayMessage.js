import React from 'react';

/**
 * @return {null}
 */
 function DisplayMessage (props) {

    // Only two options (true and false) with default being null
    const message = props.message;
    if (message.type === "success") {
        return  <div className="text-success"> {message.msg} </div>
    }
    if (message.type === "error") {
        return  <div className="text-danger"> {message.msg} </div>
    }
    return null;
};

export default DisplayMessage;
