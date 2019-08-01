import React, { Component } from 'react';
import fromCDN from "from-cdn";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router-dom";
import 'dhtmlx-scheduler';


class SchedulerHTML extends Component {
    constructor(props) {
        super(props);
        this.ready = fromCDN([
            "//cdn.dhtmlx.com/scheduler/5.0/dhtmlxscheduler.js",
            "//cdn.dhtmlx.com/scheduler/5.0/dhtmlxscheduler.css"
        ]);

    }// constructor


    componentDidMount() {
        this.ready.then(() => {
            var data = [
                { "id": "2", "start_date": "2017-05-24 00:00:00", "end_date": "2017-06-08 00:00:00", "text": "French Open", "details": "Philippe-Chatrier Court\n Paris, FRA"},
                { "id": "3", "start_date": "2017-06-10 00:00:00", "end_date": "2017-06-13 00:00:00", "text": "Aegon Championship", "details": "The Queens Club\n London, ENG"},
                { "id": "4", "start_date": "2017-06-21 00:00:00", "end_date": "2017-07-05 00:00:00", "text": "Wimbledon", "details": "Wimbledon\n June 21, 2009 - July 5, 2009"},
                { "id": "5", "start_date": "2017-06-18 00:00:00", "end_date": "2017-06-27 00:00:00", "text": "Indianapolis Tennis Championship", "details": "Indianapolis Tennis Center\n Indianapolis, IN"},
                { "id": "8", "start_date": "2017-06-27 00:00:00", "end_date": "2017-06-02 00:00:00", "text": "Countrywide Classic Tennis", "details": "Los Angeles Tennis Center.\n Los Angeles, CA  "},
                { "id": "7", "start_date": "2017-06-11 00:00:00", "end_date": "2017-06-18 00:00:00", "text": "ATP Master Tennis", "details": "La Caja Magica.\n Madrid, Spain"}
            ];

            const scheduler = window.dhtmlXScheduler;
            //const dataProcessor = window.dataProcessor;

            // Initialise scheduler to current date (month)
            let now = new Date();
            let date = now.getDate();
            let month = now.getMonth();
            let year = now.getFullYear();
            // Initialising workout scheduler to current date and display the month view
            let thisDate = new Date(year, month, date);

            /* globals scheduler */
            scheduler.config.show_loading = false;
            // Load the date from the database
            scheduler.config.xml_date = "%Y-%m-%d %H:%i";scheduler.templates.xml_date = function (value) {
                return new Date(value);
            };
            scheduler.init('workoutScheduler', thisDate, "month");
            //scheduler.parse(this.props.ptProfile.scheduler, "json");
            scheduler.parse(data, "json");
            // Add, edit, and delete data in the database
            scheduler.config.xml_date = "%Y-%m-%d %H:%i";


            // //Get token for adding/editing/deleting events
            // let token = localStorage.getItem('jwtToken');
            // // Use dataProcessor of dhtmlx scheduler to insert/update/delete data for scheduler
            // // for the current client (the id of the client is sent to the api so that the event can be
            // // associated with them, allowing client events to be filtered so only their events are retrieved
            // // and shown with GET method
            // let dataProc = new dataProcessor(`/api/${this.state.userId}/scheduler/${this.state.clientId}` );
            // dataProc.init(scheduler);
            // // Add token to header to allow access to the POST function on API
            // dataProc.setTransactionMode({mode: "POST", headers:{ "Content-Type": "application/x-www-form-urlencoded",
            //         Authorization: token}});

        });
    };

    render() {
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
        );
    }
}

SchedulerHTML.propTypes = {
    authenticatedUser: PropTypes.object.isRequired
};

// Used to pull auth state and errors into this component
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
});

export default connect(stateToProps, {})(withRouter(SchedulerHTML));
