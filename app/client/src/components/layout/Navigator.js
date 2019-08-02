import React, {Component} from 'react';
import {Link} from 'react-router-dom'; /*This will be used instead of the anchor tag for routing*/
// For dynamic navbar depending on login status (either guest link (not signed in) or authorised link (signed in))
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logOutUser } from "../../actions/authenticationActions";
import { withRouter } from 'react-router-dom';
import {getPtData, getClients, clearCurrentProfile} from "../../actions/ptProfileActions";
import {getClientData, clearClientProfile} from "../../actions/clientProfileActions";

import defaultUserImage from '../../img/user-regular.svg';

class Navigation extends Component {
    constructor(props){
        super(props);
        this.state = {
            userData: null,
        };
    }

    static getDerivedStateFromProps(props, state){
        if(props.authenticatedUser.user.pt) {
            if (props.ptProfile.pt_data !== state.userData) {
                return {
                    userData: props.ptProfile.pt_data
                }
            }
            return null;
        }
        else{
            if (props.clientProfile.client_data !== state.userData) {
                return {
                    userData: props.clientProfile.client_data
                }
            }
            return null;
        }
    }

    componentDidMount() {
        if(this.props.authenticatedUser.user.pt){
            this.props.getPtData(this.props.authenticatedUser.user.id, this.props.history);
            this.props.getClients(this.props.authenticatedUser.user.id, this.props.history);
        }
        else {
            this.props.getClientData(this.props.authenticatedUser.user.id, this.props.history);
        }
    } // ComponentDidMount

    // Create log out link functionality
    onLogOutClick(event) {
        event.preventDefault();
        if(this.props.authenticatedUser.user.pt){
            this.props.clearCurrentProfile();
        }
        else {
            this.props.clearClientProfile();
        }
        this.props.logOutUser();
        this.props.history.push('/');
    }

    render() {

        const {isAuthenticated} = this.props.authenticatedUser;
        const {userData} = this.state;

        // Define navbar for dynamic navbar
        const authorisedLinks = (
            <div className="collapse navbar-collapse" id="mobile-navigation">
                <ul className="navbar-nav ml-auto">
                    <a href="" onClick={this.onLogOutClick.bind(this)} className="nav-link">
                        <img
                            className="rounded-circle"
                            // If user has profile pic display it otherwise display default user image
                            src={userData !== null && userData.ProfilePicUrl !== "NA" ?
                             userData.ProfilePicUrl : defaultUserImage}
                            // src={isAuthenticated ? defaultUserImage : defaultUserImage}
                            alt={userData !== null && userData.ProfilePicUrl !== "NA" ? "User profile picture." : "Default user image."}
                            style={{backgroundColor: 'white', width: 30, height: 27, paddingRight: 0}}
                        />
                        {/*{' '} is used to provide space */}
                        {' '}
                        {userData !== null ? userData.FullName : null}
                        {' '}
                        - Log Out</a>
                </ul>
            </div>
        );


        const guestLinks = (
            <div className="collapse navbar-collapse" id="mobile-navigation">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/register">
                            Sign Up
                        </Link> {/*Using Link instead of anchor tag*/}
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/login">
                            Login
                        </Link> {/*Using Link instead of anchor tag*/}
                    </li>
                </ul>
            </div>
        );

        return (
            <nav className="navbar navbar-expand-sm navbar-dark navbar-custom mb-5">
                <div className="navbar-container">
                    <Link className="navbar-brand" to={isAuthenticated ? '/users/' +
                        this.props.authenticatedUser.user.id + '/dashboard' : "/"}>
                        <img src={require('../../img/logo.jpg')} alt={"Fitness app logo"}></img>
                        Fitness App
                    </Link> {/*Using Link instead of anchor tag*/}
                    <button className="navbar-toggler" type="button" data-target="#mobile-navigation" data-toggle="collapse">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/*Depending on isLoggedIn the navbar will display either authorisedLinks or guestLinks*/}
                    {isAuthenticated ? authorisedLinks :  guestLinks}
                </div>
            </nav>
        );
    }
}

// Documents what props are needed for this component and will log a warning in the console in dev mode if not complied to
Navigation.propTypes = {
    authenticatedUser: PropTypes.object.isRequired,
    ptProfile: PropTypes.object.isRequired,
    clientProfile: PropTypes.object.isRequired,
    clearCurrentProfile: PropTypes.func.isRequired,
    clearClientProfile: PropTypes.func.isRequired,
    logOutUser: PropTypes.func.isRequired,
    getPtData: PropTypes.func.isRequired,
    getClients: PropTypes.func.isRequired,
    getClientData: PropTypes.func.isRequired,
};

// Used to pull auth state into this component
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    ptProfile: state.ptProfile,
    clientProfile: state.clientProfile,
});


// connect must be exported with a passed parameter (not direct parameter) of Register this is wrapped with withRouter
// allowing the functions of the package to be used with the component eg, proper routing, and direct parameters of
// stateToProps for the 1st parameter and the action which is registerUser as the 2nd parameter
export default connect(stateToProps, { logOutUser, getClientData, getPtData, getClients, clearCurrentProfile, clearClientProfile })(withRouter(Navigation));
