import React from "react";

const Loading = ({
    myClassName
}) =>{

    return (

        <div className={"Loading-container fa-3x " + myClassName}>
            <div className={"Loading"}>
                <i className="fas fa-spinner fa-pulse"></i>
                <h1>Loading</h1></div>
        </div>
    )
};

export default Loading;
