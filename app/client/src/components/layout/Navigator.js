import React, {Component} from 'react';
import {Link} from 'react-router-dom'; /*This will be used instead of the anchor tag for routing*/
// For dynamic navbar depending on login status (either guest link (not signed in) or authorised link (signed in))
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logOutUser } from "../../actions/authenticationActions";
import { withRouter } from 'react-router-dom';
import {getPtData, getClientData, getClients} from "../../actions/profileActions";

import defaultUserImage from '../../img/user-regular.svg';

class Navigation extends Component {
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
        this.props.logOutUser();
        this.props.history.push('/');
    }

    render() {

        const {isAuthenticated} = this.props.authenticatedUser;
        const {user_data} = this.props.profile;

        // Define navbar for dynamic navbar
        const authorisedLinks = (
            <div className="collapse navbar-collapse" id="mobile-navigation">
                <ul className="navbar-nav ml-auto">
                    <a href="" onClick={this.onLogOutClick.bind(this)} className="nav-link">
                        <img
                            className="rounded-circle"
                            // If user has profile pic display it otherwise display default user image
                            src={user_data !== null && user_data.ProfilePicUrl !== "NA" ?
                             user_data.ProfilePicUrl : defaultUserImage}
                            // src={isAuthenticated ? defaultUserImage : defaultUserImage}
                            alt={user_data !== null && user_data.ProfilePicUrl !== "NA" ? "User profile picture." : "Default user image."}
                            style={{backgroundColor: 'white', width: 30, height: 27, paddingRight: 0}}
                        />
                        {/*{' '} is used to provide space */}
                        {' '}
                        {user_data !== null ? user_data.FullName : null}
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
    profile: PropTypes.object.isRequired,
    logOutUser: PropTypes.func.isRequired,
    getPtData: PropTypes.func.isRequired,
    getClients: PropTypes.func.isRequired,
    getClientData: PropTypes.func.isRequired,
};

// Used to pull auth state into this component
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    profile: state.profile
});


// connect must be exported with a passed parameter (not direct parameter) of Register this is wrapped with withRouter
// allowing the functions of the package to be used with the component eg, proper routing, and direct parameters of
// stateToProps for the 1st parameter and the action which is registerUser as the 2nd parameter
export default connect(stateToProps, { logOutUser, getClientData, getPtData, getClients })(withRouter(Navigation));
