import React from 'react'
import {Link} from "react-router-dom";

export const ProfileImage = ({image}) => {
    return (
        <Link to={`upload_profile_picture`}>
            {(<img
                className="rounded"
                alt={"User profile."}
                src = {image}
            />)}
        </Link>
    )
};

