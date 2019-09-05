import React from 'react'
import {Link} from "react-router-dom/";


const PtMenuComp = ({userData}) => {
    return (
        <span className="mr-auto">
            <li className="nav-item">
                <Link className="nav-main" to={`/users/${userData._id}/dashboard`}>
                    Dashboard
                </Link>
            </li>
            <li className="nav-item">
                <Link className="nav-main" to={`/users/${userData._id}/edit_personal_trainer`}>
                    Edit Profile
                </Link>
            </li>
            <li className="nav-item">
                <Link className="nav-main" to={`/users/${userData._id}/register_client`}>
                    Register Client
                </Link>
            </li>
        </span>
    )
};

export default PtMenuComp;
