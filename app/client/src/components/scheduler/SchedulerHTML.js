import React from 'react'

// Input all properties as parameters
const schedulerHTML = () => {
    return (
        <div className="app-screen mb-5">
            <div className="app-header">
                <div className="app-content">
                    <div id="workoutScheduler" className="widget-box dhx_cal_container">
                        <div className="dhx_cal_navline">
                            <div className="dhx_cal_prev_button">&nbsp;</div>
                            <div className="dhx_cal_next_button">&nbsp;</div>
                            <div className="dhx_cal_today_button"></div>
                            <div className="dhx_cal_date"></div>
                            <div className="dhx_cal_tab" name="day_tab" style={{right: 204 + "px"}}></div>
                            <div className="dhx_cal_tab" name="week_tab" style={{right: 140 + "px"}}></div>
                            <div className="dhx_cal_tab" name="month_tab" style={{right: 76 + "px"}}></div>
                        </div>
                        <div className="dhx_cal_header"></div>
                        <div className="dhx_cal_data"></div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default schedulerHTML;
