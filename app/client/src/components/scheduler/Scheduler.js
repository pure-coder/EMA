import React, { Component } from 'react';
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router-dom";
import {ptGetCurrentClient, ptWorkoutScheduler, ptClearWorkoutData} from "../../actions/ptProfileActions";
import {clientGetData} from "../../actions/clientProfileActions";
import 'dhtmlx-scheduler';
import Loading from "../common/Loading";
import isEmpty from "../../utilities/is_empty";
import ErrorComponent from "../error/ErrorComponent";
import UserInfo from "../dashboard/profile/UserInfo";
import SchedulerHTML from "./SchedulerHTML";
import checkExp from "../../utilities/checkExp";


class Scheduler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clientId: props.authenticatedUser.user.pt ? props.match.params.cid : props.authenticatedUser.user.id,
            userId: props.authenticatedUser.user.id,
            errors: {},
            loading: true,
        };

        this.props.ptWorkoutScheduler(this.state.userId, this.state.clientId);
    }// constructor


    componentDidMount() {
        const {isAuthenticated} = this.props.authenticatedUser;
        if(!isAuthenticated)
            this.props.history.push('/login');
        checkExp();
        // Check if isAuthenticated is false then redirect to the dashboard
        if(this.props.authenticatedUser.user.pt){
            this.props.ptGetCurrentClient(this.state.clientId, this.props.history);
        }
        else {
            this.props.clientGetData(this.state.clientId, this.props.history);
        }
    };

    componentWillUnmount(){
        this.props.ptClearWorkoutData();
    }

    render() {

        const {user} = this.props.authenticatedUser;
        const Data = {
            data: this.props.ptProfile.scheduler,
            uid: this.state.userId,
            cid: this.state.clientId
        };

        let client_data = null;

        if(user.pt){
            client_data = this.props.ptProfile.current_client;
        }
        else {
            client_data = this.props.clientProfile.client_data;
        }

        if(Data.data === null  || client_data === null){
            return <Loading myClassName="loading_container"/>
        }
        if(isEmpty(user)){
            return <ErrorComponent/>
        }
        else {
            return (
                <div id="scheduler-container">
                    <h1 className=" text-center display-5 mb-3">Workout Schedule</h1>
                    <UserInfo userData={client_data}/>
                    <SchedulerHTML Data={Data}/>
                </div>
            );
        }
    }
}

Scheduler.propTypes = {
    authenticatedUser: PropTypes.object.isRequired,
    ptProfile: PropTypes.object.isRequired,
    clientProfile: PropTypes.object.isRequired,
    ptGetCurrentClient: PropTypes.func.isRequired,
    clientGetData: PropTypes.func.isRequired,
    ptWorkoutScheduler: PropTypes.func.isRequired,
    ptClearWorkoutData: PropTypes.func.isRequired
};

// Used to pull auth state and errors into this component
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    ptProfile: state.ptProfile,
    clientProfile: state.clientProfile
});

export default connect(stateToProps, {clientGetData, ptGetCurrentClient, ptWorkoutScheduler, ptClearWorkoutData})(withRouter(Scheduler));
