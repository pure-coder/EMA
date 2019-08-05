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
        document.body.scrollTo(0,0);
        const {data, uid, cid} = this.props.Data;

        this.ready.then(() => {
            // const scheduler = window.dhtmlXScheduler;
            const dataProcessor = window.dataProcessor;

            // Initialise scheduler to current date (month)
            let now = new Date();
            let date = now.getDate();
            let month = now.getMonth();
            let year = now.getFullYear();
            // Initialising workout scheduler to current date and display the month view
            let thisDate = new Date(year, month, date);

            /* globals scheduler */
            // Needs clearAll as it was retaining previous clients data
            scheduler.clearAll();
            scheduler.config.show_loading = false;
            // Load the date from the database
            scheduler.config.xml_date = "%Y-%m-%d %H:%i";scheduler.templates.xml_date = function (value) {
                return new Date(value);
            };
            scheduler.init('workoutScheduler', thisDate, "week");
            //scheduler.parse(this.props.ptProfile.scheduler, "json");
            scheduler.parse(data, "json");
            // Add, edit, and delete data in the database
            scheduler.config.xml_date = "%Y-%m-%d %H:%i";



            //Get token for adding/editing/deleting events
            let token = localStorage.getItem('jwtToken');
            // Use dataProcessor of dhtmlx scheduler to insert/update/delete data for scheduler
            // for the current client (the id of the client is sent to the api so that the event can be
            // associated with them, allowing client events to be filtered so only their events are retrieved
            // and shown with GET method
            let dataProc = new dataProcessor(`/api/${uid}/scheduler/${cid}` );
            dataProc.init(scheduler);
            // Add token to header to allow access to the POST function on API
            dataProc.setTransactionMode({mode: "POST", headers:{ "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: token}});

        });
    };

    componentWillUnmount(){
        // Needs clearAll as it was retaining previous clients data
        scheduler.clearAll();
    }

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
