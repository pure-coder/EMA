import React, {Component} from 'react';
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router-dom";
import axios from 'axios';
import 'dhtmlx-scheduler';

class Scheduler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            errors: {}
        }

        const scheduler = window.dhtmlXScheduler;
        const dataProcessor = window.dataProcessor;

        axios.get('/api/scheduler')
            .then(result => {
                if (result) {

                    let now = new Date();
                    let date = now.getDate();
                    let month = now.getMonth();
                    let year = now.getFullYear();
                    // Initialising workout scheduler to current date and display the month view
                    scheduler.init('scheduler', new Date(year, month, date), "month")

                    // Load the data from the database
                    scheduler.templates.xml_date = function (value) {
                        return new Date(value);
                    };

                    // Parse data from database and populate scheduler
                    scheduler.parse(result.data, "json");
                }
            })
            .catch(err => console.log(err)); // log error of collecting data to console

        // Add, edit, and delete data in the database
        scheduler.config.xml_date = "%Y-%m-%d %H:%i";


        //Get token for adding/editing/deleting events
        let token = localStorage.getItem('jwtToken')

        let dataProc = new dataProcessor("/api/scheduler");
        dataProc.init(scheduler);

        // Add token header to allow access to the POST function on API
        dataProc.setTransactionMode({mode: "POST", headers:{ "Content-Type": "application/x-www-form-urlencoded",
        Authorization: token}});

        //dataProc.setTransactionMode("POST", false);

    }// constructor

    // add init() function to only the scheduler route in index.html (located in public folder) before the component is rendered
    // and check if user is authenticated
    componentDidMount() {
        // Check if isAuthenticated is false then redirect to the dashboard
        if (!this.props.authenticatedUser.isAuthenticated) {
            this.props.history.push('/login');
        }
    }


    // Life cycle method for react which will run when this component receives new properties
    componentWillReceiveProps(nextProps) {

        // Check if isAuthenticated is false then redirect to the dashboard
        if (!nextProps.authenticatedUser.isAuthenticated) {
            this.props.history.push('/login');
        }
    }

    render() {
        return (
            <div id="scheduler" className="dhx_cal_container scheduler">
                <div className="dhx_cal_navline">
                    <div className="dhx_cal_prev_button">&nbsp;</div>
                    <div className="dhx_cal_next_button">&nbsp;</div>
                    <div className="dhx_cal_today_button"></div>
                    <div className="dhx_cal_date"></div>
                    <div className="dhx_cal_tab" name="day_tab"></div>
                    <div className="dhx_cal_tab" name="week_tab"></div>
                    <div className="dhx_cal_tab" name="month_tab"></div>
                </div>
                <div className="dhx_cal_header">
                </div>
                <div className="dhx_cal_data">
                </div>
            </div>
        );
    }
}

// Documents what props are needed for this component and will log a warning in the console in dev mode if not complied to
Scheduler.propTypes = {
    authenticatedUser: PropTypes.object.isRequired,
    //data: PropTypes.array.isRequired
}

// Used to pull auth state and errors into this component
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    data: state.data
});

// connect must be exported with a passed parameter (not direct parameter) of scheduler this is wrapped with withRouter
// allowing the functions of the package to be used with the component eg, proper routing, and direct parameters of
// stateToProps for the 1st parameter and the action which is registerUser as the 2nd parameter
export default connect(stateToProps)(withRouter(Scheduler));

