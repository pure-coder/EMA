import React from 'react'
import Workout from "./Workout";
import isEmpty from '../../../utilities/is_empty';

const NextWorkouts = ({nextWorkouts}) => {

    const workoutStatus = !isEmpty(nextWorkouts);
    let displayContent;

    if(workoutStatus){
        displayContent = (
            <table className="table client-table">
                <thead>
                <tr className="even-row">
                    <th align="center"></th>
                    <th style={{textAlign: 'left', paddingLeft: '5px'}}>Client Name</th>
                    <th align="center">Date</th>
                    <th align="center">time</th>
                </tr>
                {nextWorkouts.map((workout, index) => {
                    return( <Workout key={workout.id} workout={workout} index={index}/>)
                })}
                </thead>
            </table>
        )
    }
    else {
        displayContent = (
            <div>
                <h4 style={{textAlign: 'center'}}> No workouts have been planned.</h4>
            </div>
        )
    }


    return (
        <div className={workoutStatus ? "next_workout_comp card" : "no_workout card"} >
            <h5 style={{textAlign: 'center'}}>Next 5 workout sessions</h5>
            {
                displayContent
            }
        </div>
    )
};

export default NextWorkouts;
