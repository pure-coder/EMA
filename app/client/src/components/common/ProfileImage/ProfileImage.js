import React from 'react'
import defaultUserImage from '../../../img/user-regular.svg';

export const ProfileImage = ({image}) => {
    if(image === null || image === undefined){
        image = defaultUserImage;
    }
    return (
        (<img
            className="rounded"
            alt={"User profile."}
            src = {image}
        />)
    );
};

