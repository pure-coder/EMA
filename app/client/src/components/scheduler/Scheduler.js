import React, {Component} from 'react';
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

// Todo :: change save button so clients cant save or edit workout!

class Scheduler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clientId: props.authenticatedUser.user.pt ? props.match.params.cid : props.authenticatedUser.user.id,
            userId: props.authenticatedUser.user.id,
            errors: {},
            loaded: false
        };

        const scheduler = window.dhtmlXScheduler;
        const dataProcessor = window.dataProcessor;

        console.log(this.state.userId, this.state.clientId)

        // If client - userId will only be used, will show their events, if pt userId is pt, clientId is client events that
        // pt wishes to view (clientId added when pt clicks client on their dashboard)
        axios.get(`/api/${this.state.userId}/scheduler/${this.state.clientId}`)
            .then(result => {
                if (result) {
                    // Initialise scheduler to current date (month)
                    let now = new Date();
                    let date = now.getDate();
                    let month = now.getMonth();
                    let year = now.getFullYear();
                    // Initialising workout scheduler to current date and display the month view
                    scheduler.config.show_loading = false;
                    let thisDate = new Date(year, month, date);
                    scheduler.init('scheduler', thisDate, "month");
                    // Load the date from the database
                    scheduler.templates.xml_date = function (value) {
                        return new Date(value);
                    };
                    // Parse data from database and populate scheduler
                    scheduler.parse(result.data, "json");
                    return result;
                }
            })
            .catch(err => {
                console.log(err)
            }); // log error of presenting data to console

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

        // // Custom scheduler lightbox
        // scheduler.config.buttons_right = ["dhx_save_btn","update","dhx_delete_btn"];
        // scheduler.config.buttons_left = ["dhx_cancel_btn"];
        // scheduler.locale.labels["update"] = "Update";
        //
        // scheduler.attachEvent("onLightboxButton", function(button_id, node, e){
        //     if(button_id === "update"){
        //         const id = scheduler.getState().select_id;
        //         alert(id);
        //     }
        // });
    }// constructor

    static getDerivedStateFromProps(nextProps, state){
        if(nextProps.errors !== state.errors){
            return {
                errors: nextProps.errors,
                loaded: true,
            }
        }
        return null;
    }

    // add init() function to only the scheduler route in index.html (located in public folder) before the component is rendered
    // and check if user is authenticated
    componentDidMount() {
        // Check if isAuthenticated is false then redirect to the dashboard
        // this.authCheck();
        if(this.props.authenticatedUser.user.pt){
            this.props.getCurrentClient(this.state.clientId, this.props.history);
        }
        else {
            this.props.getClientData(this.state.clientId, this.props.history);
        }

    }

    componentDidUpdate(){
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

        console.log(client_data)
        if(client_data === null){
            return <Loading/>
        }
        if(isEmpty(user)){
            return <ErrorComponent/>
        }
        else{
            return (
                <div id="scheduler-container">
                    <h1 className=" text-center display-5 mb-3">Workout Scheduler</h1>
                    <UserInfo userData={client_data}/>
                    <div id="scheduler" className="dhx_cal_container scheduler mt-5">
                        <div className="dhx_cal_navline">
                            <div className="dhx_cal_prev_button">&nbsp;</div>
                            <div className="dhx_cal_next_button">&nbsp;</div>
                            <div className="dhx_cal_today_button"></div>
                            <div className="dhx_cal_date"></div>
                            <div className="dhx_cal_tab" name="day_tab"></div>
                            <div className="dhx_cal_tab" name="week_tab"></div>
                            <div className="dhx_cal_tab" name="month_tab"></div>
                        </div>
                        <div className="dhx_cal_header"></div>
                        <div className="dhx_cal_data"></div>
                    </div>
                </div>
            );
        }
    }
}

// Documents what props are needed for this component and will log a warning in the console in dev mode if not complied to
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

// connect must be exported with a passed parameter (not direct parameter) of scheduler this is wrapped with withRouter
// allowing the functions of the package to be used with the component eg, proper routing, and direct parameters of
// stateToProps for the 1st parameter and the action which is registerUser as the 2nd parameter
export default connect(stateToProps, {getClientData, getCurrentClient})(withRouter(Scheduler));
