import React, {Component} from 'react';
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router-dom";
import { userData } from "../../actions/authenticationActions";

class Scheduler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataPosted: {},
            errors: {}
        }
    }// constructor

    // add init() function to only the scheduler route in index.html (located in public folder) before the component is rendered
    // and check if user is authenticated
    componentDidMount() {
        document.getElementsByTagName('body')[0].setAttribute('onload', 'init();');

        // Check if isAuthenticated is false then redirect to the dashboard
        if (!this.props.authenticatedUser.isAuthenticated) {
            this.props.history.push('/login');
        }

        //this.props.userData();
    }


    // Life cycle method for react which will run when this component receives new properties
    componentWillReceiveProps(nextProps) {

        // Check if isAuthenticated is false then redirect to the dashboard
        if(!nextProps.authenticatedUser.isAuthenticated){
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
    userData: PropTypes.func.isRequired,
    authenticatedUser: PropTypes.object.isRequired,
}

// Used to pull auth state and errors into this component
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    dataPosted: state.dataPosted
});

// connect must be exported with a passed parameter (not direct parameter) of Scheduler this is wrapped with withRouter
// allowing the functions of the package to be used with the component eg, proper routing, and direct parameters of
// stateToProps for the 1st parameter and the action which is registerUser as the 2nd parameter
export default connect(stateToProps, { userData })(withRouter(Scheduler));

