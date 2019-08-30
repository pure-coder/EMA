import React from 'react'

const Workout = ({workout, index}) => {

    let date = workout.start_date.toString().substring(0, 10);
    let time = workout.start_date.toString().substring(11,16);

    return (<tr className={index % 2 === 0 ? 'next_workout odd-row' : 'next_workout even-row'}>
                <td align="center" className="workout"><img className="rounded" src={workout.clientImage} alt="workout"/></td>
                <td style={{textAlign: 'left', paddingLeft: '5px'}} className="workout">{workout.clientName}</td>
                <td align="center" className="workout">{date}</td>
                <td align="center" className="workout">{time}</td>
            </tr>)
};

export default Workout;
