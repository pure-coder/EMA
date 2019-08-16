import React from 'react'
import defaultUserImage from '../../../img/user-regular.svg';

export const ProfileImage = ({image, style}) => {

    if(image === null){
        image = defaultUserImage;
    }

    return (
            (<img
                className="rounded"
                alt={"User profile."}
                src = {image}
                style={style}
            />)
    )
};

