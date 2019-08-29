import React from 'react';

export const ProgressTitleComp = ({
        Title
    }) => {
    return (
        <div>
            <h2 className=" text-center display-5 mt-5 mb-4">
                {Title}
                </h2>
            <h6 className=" text-center display-5 mt-3 mb-4">
                (Showing exercise data that have 2+ data entries)
            </h6>
        </div>
        )
};
