import React from 'react'

const Workout = ({workout}) => {

    let date = workout.start_date.toString().substring(0, 10);
    let time = workout.start_date.toString().substring(11,16);

    return (
        <div>
            <span className="next_workout">
                <span className="workout"><img className="rounded" src={workout.clientImage} alt="workout"/></span>
                <span className="workout">{workout.clientName}</span>
                <span className="workout">Date: {date}</span>
                <span className="workout">Time: {time}</span>
            </span>
        </div>
    )
};

export default Workout;
