import React from "react";

const Loading = ({
    myClassName
}) =>{

    return (

        <div className={"Loading fa-3x " + myClassName}>
            <i className="fas fa-spinner fa-pulse"></i>
            <h1>Loading</h1>
        </div>
    )
};

export default Loading;
