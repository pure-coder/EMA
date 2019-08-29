import React from 'react'
import Workout from "./Workout";

const NextWorkouts = ({nextWorkouts}) => {
    return (
        <div className="next_workout_comp card">
            <label style={{alignContent: 'center'}}>Up coming workouts</label>
            {
                nextWorkouts.map((workout, index) =>
                    <Workout key={index} workout={workout}/>
                )

            }
        </div>
    )
};

export default NextWorkouts;
