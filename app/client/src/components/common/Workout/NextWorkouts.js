import React from 'react'
import Workout from "./Workout";

const NextWorkouts = ({nextWorkouts}) => {
    return (
        <div className="next_workout_comp card" >
            <h5 style={{textAlign: 'center'}}>Next 5 workout sessions</h5>
            {
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


            }
        </div>
    )
};

export default NextWorkouts;
