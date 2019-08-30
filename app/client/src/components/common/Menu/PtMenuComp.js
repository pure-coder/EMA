import React from 'react'
import {Link} from "react-router-dom/";


const PtMenuComp = ({userData}) => {
    return (
        <span>
            <Link className="nav-main" to={`/users/${userData._id}/dashboard`}>
                Dashboard
            </Link>
            <Link className="nav-main" to={`/users/${userData._id}/edit_personal_trainer`}>
                Edit Profile
            </Link>
            <Link className="nav-main" to={`/users/${userData._id}/register_client`}>
                Register Client
            </Link>
        </span>
    )
};

export default PtMenuComp;
