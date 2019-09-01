import React from 'react'

const Workout = ({workout, index}) => {

    // Old format used
    // let date = workout.start_date.toString().substring(0, 10);
    let time = workout.start_date.toString().substring(11,16);
    let dateOther = new Date(workout.start_date);

    let weekday = new Array(7);
    weekday[0] =  "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tues";
    weekday[3] = "Wed";
    weekday[4] = "Thurs";
    weekday[5] = "Fri";
    weekday[6] = "Sat";

    let month = new Array(12);
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    let aMonth = month[dateOther.getMonth()].toString();
    let weekDay = weekday[dateOther.getDay()].toString();
    let day = dateOther.getDate().toString();

    if(day === '1' || day === '21' || day === '31'){
        day = day.concat("st");
    }
    else if (day === '2' || day === '22'){
        day = day.concat("nd");
    }
    else if (day === '3' || day === '23'){
        day = day.concat("rd");
    }
    else{
        day = day.concat("th");
    }

    return (<tr className={index % 2 === 0 ? 'next_workout odd-row' : 'next_workout even-row'}>
                <td align="center" className="workout"><img className="rounded" src={workout.clientImage} alt="workout"/></td>
                <td style={{textAlign: 'left', paddingLeft: '5px'}} className="workout">{workout.clientName}</td>
                <td style={{textAlign: 'left'}} align="center" className="workout">{weekDay}, {day} {aMonth}</td>
                <td style={{textAlign: 'left'}} className="workout">{time}</td>
            </tr>)
};

export default Workout;
