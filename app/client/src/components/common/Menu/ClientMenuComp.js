import React from 'react'
import {Link} from "react-router-dom/";

const ClientMenuComp = ({userData}) => {
    return (
        <span className="mr-auto">
            <li className="nav-item">
                <Link className="nav-main" to={`/users/${userData._id}/dashboard`}>
                    Dashboard
                </Link>
            </li>
            <li className="nav-item">
                <Link className="nav-main" to={`/users/${userData._id}/client_profile`}>
                    Profile
                </Link>
            </li>
            <li className="nav-item">
                <Link className="nav-main" to={`/users/${userData._id}/scheduler`}>
                    Workout Scheduler
                </Link>
            </li>
            <li className="nav-item">
                <Link className="nav-main" to={`/users/${userData._id}/edit_client`}>
                    Edit Profile
                </Link>
            </li>
        </span>
    )
};

export default ClientMenuComp;
