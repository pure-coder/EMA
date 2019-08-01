import React, { Component } from 'react';
import fromCDN from "from-cdn";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router-dom";
import axios from 'axios';
import {getCurrentClient} from "../../actions/ptProfileActions";
import {getClientData} from "../../actions/clientProfileActions";
import 'dhtmlx-scheduler';
import Loading from "../../elements/Loading";
import isEmpty from "../../utilities/is_empty";
import ErrorComponent from "../error/ErrorComponent";
import UserInfo from "../dashboard/UserInfo";
import SchedulerHTML from "./SchedulerHTML";


class Scheduler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clientId: props.authenticatedUser.user.pt ? props.match.params.cid : props.authenticatedUser.user.id,
            userId: props.authenticatedUser.user.id,
            errors: {},
            loading: true,
        };

        this.ready = fromCDN([
            "//cdn.dhtmlx.com/scheduler/5.0/dhtmlxscheduler.js",
            "//cdn.dhtmlx.com/scheduler/5.0/dhtmlxscheduler.css"
        ]);

        this.ready.then(() => {
                axios.get(`/api/${this.state.userId}/scheduler/${this.state.clientId}`)
                    .then(result => {
                        if (result) {

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
                            scheduler.config.show_loading = false;
                            scheduler.config.xml_date = "%Y-%m-%d %H:%i";
                            scheduler.init('workoutScheduler', thisDate, "month");
                            // Load the date from the database
                            scheduler.templates.xml_date = function (value) {
                                return new Date(value);
                            };
                            scheduler.parse(result.data, "json");

                            // Add, edit, and delete data in the database
                            scheduler.config.xml_date = "%Y-%m-%d %H:%i";
                            //Get token for adding/editing/deleting events
                            let token = localStorage.getItem('jwtToken');


                            // Use dataProcessor of dhtmlx scheduler to insert/update/delete data for scheduler
                            // for the current client (the id of the client is sent to the api so that the event can be
                            // associated with them, allowing client events to be filtered so only their events are retrieved
                            // and shown with GET method
                            let dataProc = new dataProcessor(`/api/${this.state.userId}/scheduler/${this.state.clientId}` );
                            dataProc.init(scheduler);
                            // Add token to header to allow access to the POST function on API
                            dataProc.setTransactionMode({mode: "POST", headers:{ "Content-Type": "application/x-www-form-urlencoded",
                                    Authorization: token}});

                        }})
                    .catch(err => {
                        console.log(err)
                    });
            }
        )

    }// constructor


    componentDidMount() {
        // Check if isAuthenticated is false then redirect to the dashboard
        if(this.props.authenticatedUser.user.pt){
            this.props.getCurrentClient(this.state.clientId, this.props.history);
        }
        else {
            this.props.getClientData(this.state.clientId, this.props.history);
        }
    }


    render() {

        const {user} = this.props.authenticatedUser;

        let client_data = null;

        if(user.pt){
            client_data = this.props.ptProfile.current_client;
        }
        else {
            client_data = this.props.clientProfile.client_data;
        }

        if(client_data === null){
            return <Loading myClassName="loading_container"/>
        }
        if(isEmpty(user)){
            return <ErrorComponent/>
        }
        else {
            return (

                <div id="scheduler-container">
                    <h1 className=" text-center display-5 mb-3">Workout Scheduler</h1>
                    <UserInfo userData={client_data}/>
                    <SchedulerHTML/>
                </div>
            );
        }
    }
}

Scheduler.propTypes = {
    authenticatedUser: PropTypes.object.isRequired,
    ptProfile: PropTypes.object.isRequired,
    clientProfile: PropTypes.object.isRequired,
    getCurrentClient: PropTypes.func.isRequired,
    getClientData: PropTypes.func.isRequired
};

// Used to pull auth state and errors into this component
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    ptProfile: state.ptProfile,
    clientProfile: state.clientProfile
});

export default connect(stateToProps, {getClientData, getCurrentClient})(withRouter(Scheduler));
