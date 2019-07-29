import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {withRouter} from 'react-router-dom';
import {getClients, getPtData, getClientData, clearErrors, clearSuccess} from "../../actions/profileActions";
import ClientList from './clients/ClientList'
import Loading from "../../elements/Loading";
import ClientData from "./clients/ClientData";
import isEmpty from "../../utilities/is_empty";
import ErrorComponent from "../error/ErrorComponent";
import UserInfo from "./UserInfo";

class Dashboard extends Component {
    // Life cycle method for react which will run when this component receives new properties
    componentDidMount() {
        if(this.props.profile.user_data === null){
            if(this.props.authenticatedUser.user.pt){
                this.props.getPtData(this.props.authenticatedUser.user.id, this.props.history);
                this.props.getClients(this.props.authenticatedUser.user.id, this.props.history);
            }
            else {
                this.props.getClientData(this.props.authenticatedUser.user.id, this.props.history);
            }
        }
        document.body.scrollTo(0,0);
        this.props.clearErrors();
        this.props.clearSuccess();
    } // ComponentDidMount


    render() {

        const {user} = this.props.authenticatedUser;
        const {user_data, loading, clients} = this.props.profile;

        if (user_data === null || loading) {
            return <Loading myClassName="loading_container"/>
        }
        if(isEmpty(user)){
            return <ErrorComponent/>
        }
        else {
            let displayContent;

            // If user is a PT then display pt dashboard of clients
            if (user.pt) {
                if (user_data === null || clients === undefined) {
                    return <Loading myClassName="loading_container"/>
                }
                // Define content to display.. in this case the list of clients
                displayContent = (
                    // send clients data to client component, and render client component
                    <div className="dashboard-custom">
                        <UserInfo userData={user_data}/>
                        <ClientList clients={clients}/>
                    </div>
                )
            } // If PT

            // If user is not a PT then display dashboard of client data
            else {
                if (user_data === null) {
                    return <Loading myClassName="loading_container"/>
                }
                // Define content to display..
                displayContent = (
                    // send clients data to client component, and render client component
                    <div className="dashboard-custom client">
                        <UserInfo userData={user_data}/>
                        <ClientData/>
                    </div>
                )
            } // If PT

            return (
                <div className="dashboard-container">
                    <h1 className=" text-center display-5 mb-3">Dashboard</h1>
                    {displayContent}
                </div>
            );
        }
    }
}

// Documents what props are needed for this component and will log a warning in the console in dev mode if not complied to
Dashboard.propTypes = {
    authenticatedUser: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    getClients: PropTypes.func.isRequired,
    getClientData: PropTypes.func.isRequired,
    getPtData: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
};

// Used to pull auth state and errors into this component.... DEFINED IN reducers/index.js {combineReducers} !!!! USED FOR THE REDUX STORE
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser, // authenticatedUser is set in index.js file in the reducers folder
    profile: state.profile,
    errors: state.errors, // errors is set in index.js file in the reducers folder
    location: state.location
});

export default connect(stateToProps, {getClients, getPtData, getClientData, clearSuccess, clearErrors})(withRouter(Dashboard));
