import React from 'react'
import Link from "react-router-dom/es/Link";

const ClientMenuComp = ({userData}) => {
    return (
        <span>
            <Link className="nav-main" to={`/users/${userData._id}/dashboard`}>
                Dashboard
            </Link>
            <Link className="nav-main" to={`/users/${userData._id}/client_profile`}>
                Profile
            </Link>
            <Link className="nav-main" to={`/users/${userData._id}/scheduler`}>
                Workout Scheduler
            </Link>
            <Link className="nav-main" to={`/users/${userData._id}/edit_client`}>
                Edit Profile
            </Link>
        </span>
    )
};

export default ClientMenuComp;
