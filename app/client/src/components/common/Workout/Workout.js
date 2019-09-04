import React from 'react'
import defaultUserImage from '../../../img/user-regular.svg';
import {Link} from "react-router-dom";

const Workout = ({workout, index}) => {

    // Old format used

    let time = workout.start_date.toString().substring(11,16);
    let dateOther = new Date(workout.start_date);
    // Link format needed for scheduler component
    let date = new Date (dateOther.getFullYear(), dateOther.getMonth(), dateOther.getDate());

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

    // Check if user has image, if not place default image in.
    if(workout.clientImage === null){
        workout.clientImage = defaultUserImage;
    }

    let path;

    // Different path for pt and client
    if(workout.ptId !== undefined){
        path = `/users/${workout.ptId}/scheduler/${workout.clientId}`
    }
    else {
        path = `/users/${workout.clientId}/scheduler`;
    }

    // If user uses mouse scroll click on link date is not sent to new page via state, so using search param, need to add dash for url
    let dateParam = date.toString().replace(/\s+/g, '-');


    return (
        <tr className={index % 2 === 0 ? 'next_workout odd-row' : 'next_workout even-row'}>
            <td align="center" className="workout"><img className="rounded" src={workout.clientImage} alt="workout"/></td>
            <td style={{textAlign: 'left', paddingLeft: '5px'}} className="workout">{workout.clientName}</td>
            <td style={{textAlign: 'left'}} align="center" className="workout">{weekDay}, {day} {aMonth}</td>
            <td style={{textAlign: 'left'}} className="workout">{time}</td>
            <td style={{textAlign: 'left', paddingLeft: '10px'}}>
                <Link to={{pathname: path, search: `?${dateParam}` }}>
                    <i className="far fa-calendar-alt fa-1x"></i>
                </Link>
            </td>
        </tr>
    )
};

export default Workout;
