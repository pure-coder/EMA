import React, {Component} from 'react';
import {Link} from 'react-router-dom'; /*This will be used instead of the anchor tag for routing*/
// For dynamic navbar depending on login status (either guest link (not signed in) or authorised link (signed in))
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logOutUser } from "../../actions/authenticationActions";
import { withRouter } from 'react-router-dom';
import {getPtData, getClientData} from "../../actions/authenticationActions";

import defaultUserImage from '../../img/user-regular.svg';
import isEmpty from "../../validation/is_empty";

class Navigation extends Component {
    constructor(props){
        super(props);
        this.state = {
            userData: props.authenticatedUser.pt_data
        }
    }

    static getDerivedStateFromProps(props, state){
        if(props.authenticatedUser.isAuthenticated){
            if(props.authenticatedUser.user.pt){
                if(props.authenticatedUser.pt_data !== state.userData || !isEmpty(state.userData)){
                    return {
                        userData: props.authenticatedUser.pt_data
                    }
                }
                // If props.authenticatedUser.pt_data does not exist then get data
                else{
                    props.getPtData(props.authenticatedUser.user.id, props.history)
                }
            }
            else {
                if(props.authenticatedUser.client_data !== state.userData){
                    return {
                        userData: props.authenticatedUser.client_data
                    }
                }
                // If props.authenticatedUser.client_data does not exist then get data
                else{
                    props.getClientData(props.authenticatedUser.user.id, props.history)
                }
            }
        }
        
        return null;
    }

    // Had to add this to solve registerClient nav issue with loading name of user
    componentDidUpdate(prevProps, state){
        // Check if user is authenticated and that the user is a pt before trying to access auth data as it will otherwise crash.
        if(prevProps.authenticatedUser.isAuthenticated && prevProps.authenticatedUser.user.pt){
            if (prevProps.authenticatedUser.pt_data !== state.userData){
                this.setState({userData: prevProps})
            }
        }
    }

    // Create log out link functionality
    onLogOutClick(event) {
        event.preventDefault();
        this.props.logOutUser();
        this.props.history.push('/');
    }

    render() {
        const isAuthenticated = this.props.authenticatedUser.isAuthenticated;
        let user = this.state.userData;

        // Define navbar for dynamic navbar
        const authorisedLinks = (
            <div className="collapse navbar-collapse" id="mobile-navigation">
                <ul className="navbar-nav ml-auto">
                    <a href="" onClick={this.onLogOutClick.bind(this)} className="nav-link">
                        <img
                            className="rounded-circle"
                            // If user has profile pic display it otherwise display default user image
                            // Todo - src={isLoggedIn ? user.profilePic : defaultUserImage} --- and add profilePic to user
                            src={isAuthenticated ? defaultUserImage : defaultUserImage}
                            alt={isAuthenticated ? "User profile picture." : "Default user image."}
                            style={{backgroundColor: 'white', width: 30, height: 27, paddingRight: 0}}
                        />
                        {/*{' '} is used to provide space */}
                        {' '}
                        {user !== undefined ? user.FullName : null}
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
                    <Link className="navbar-brand" to={this.props.authenticatedUser.isAuthenticated ? '/users/' +
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
    logOutUser: PropTypes.func.isRequired,
    authenticatedUser: PropTypes.object.isRequired,
    getClientData: PropTypes.func.isRequired,
    getPtData: PropTypes.func.isRequired
};

// Used to pull auth state into this component
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
});


// connect must be exported with a passed parameter (not direct parameter) of Register this is wrapped with withRouter
// allowing the functions of the package to be used with the component eg, proper routing, and direct parameters of
// stateToProps for the 1st parameter and the action which is registerUser as the 2nd parameter
export default connect(stateToProps, { logOutUser, getClientData, getPtData })(withRouter(Navigation));
