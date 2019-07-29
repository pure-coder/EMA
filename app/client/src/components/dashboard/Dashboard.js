import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {withRouter} from 'react-router-dom';
import {getClients, clearErrors, clearSuccess} from "../../actions/profileActions";
import ClientList from './clients/ClientList'
import Loading from "../../elements/Loading";
import ClientData from "./clients/ClientData";
import isEmpty from "../../utilities/is_empty";
import ErrorComponent from "../error/ErrorComponent";
import UserInfo from "./UserInfo";

class Dashboard extends Component {
    // Life cycle method for react which will run when this component receives new properties
    componentDidMount() {
        if(this.props.authenticatedUser.user.pt){
            this.props.getClients(this.props.authenticatedUser.user.id, this.props.history);
        }

        document.body.scrollTo(0,0);
        this.props.clearErrors();
        this.props.clearSuccess();
    } // ComponentDidMount


    render() {
        if (this.props.profile.loading) {
            return <Loading myClassName="loading_container"/>
        }
        if(isEmpty(this.props.authenticatedUser.user)){
            return <ErrorComponent/>
        }
        else {
            let displayContent;

            // If user is a PT then display pt dashboard of clients
            if (this.props.authenticatedUser.user.pt) {
                if (this.props.profile.clients === undefined) {
                    return <Loading myClassName="loading_container"/>
                }
                // Define content to display.. in this case the list of clients
                displayContent = (
                    // send clients data to client component, and render client component
                    <div className="dashboard-custom">
                        <UserInfo userData={this.props.profile.user_data}/>
                        <ClientList clients={this.props.profile.clients}/>
                    </div>
                )
            } // If PT

            // If user is not a PT then display dashboard of client data
            else {
                if (this.props.profile.user_data === null) {
                    return <Loading myClassName="loading_container"/>
                }
                // Define content to display..
                displayContent = (
                    // send clients data to client component, and render client component
                    <div className="dashboard-custom client">
                        <UserInfo userData={this.props.profile.user_data}/>
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
    getClients: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired,
    authenticatedUser: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

// Used to pull auth state and errors into this component.... DEFINED IN reducers/index.js {combineReducers} !!!! USED FOR THE REDUX STORE
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser, // authenticatedUser is set in index.js file in the reducers folder
    profile: state.profile,
    errors: state.errors, // errors is set in index.js file in the reducers folder
    location: state.location
});

export default connect(stateToProps, {getClients, clearSuccess, clearErrors})(withRouter(Dashboard));
