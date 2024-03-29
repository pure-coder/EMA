import React, {Component} from 'react';
import {Link} from 'react-router-dom'; /*This will be used instead of the anchor tag for routing*/
// For dynamic navbar depending on login status (either guest link (not signed in) or authorised link (signed in))
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logOutUser } from "../../redux/actions/authenticationActions";
import { withRouter } from 'react-router-dom';
import {
    ptGetData,
    ptClearProfile
} from "../../redux/actions/ptProfileActions";
import {
    clientGetData,
    clientClearProfile
} from "../../redux/actions/clientProfileActions";

import {ProfileImage} from "../common/ProfileImage/ProfileImage";
import PtMenuComp from "../common/Menu/PtMenuComp";
import ClientMenuComp from "../common/Menu/ClientMenuComp";

class Navigation extends Component {
    constructor(props){
        super(props);
        this.state = {
            userData: null,
            ProfilePicUrl: null,
            loaded: false
        };
    }

    componentDidUpdate(prevProps){
        const {isAuthenticated, user} = this.props.authenticatedUser;
        const {pt_data} = this.props.ptProfile;
        const {client_data} = this.props.clientProfile;

        if(isAuthenticated){
            if(user.pt){
                if(prevProps.ptProfile.pt_data !== pt_data){
                    this.setState({
                        userData: pt_data,
                        ProfilePicUrl: pt_data.ProfilePicUrl
                    });
                }
            }
            else {
                // if(prevProps.clientProfile.client_data !== this.state.userData ||
                if(prevProps.clientProfile.client_data !== client_data) {
                    this.setState({
                        userData: client_data,
                        ProfilePicUrl: client_data.ProfilePicUrl
                    })
                }
            }
        } // isAuthenticated
    }

    componentDidMount() {
        const {isAuthenticated} = this.props.authenticatedUser;
        if(isAuthenticated){
            if(this.props.authenticatedUser.user.pt){
                this.props.ptGetData();
            }
            else {
                this.props.clientGetData();
            }
        }
    } // ComponentDidMount

    // Create log out link functionality
    onLogOutClick = e => {
        e.preventDefault();
        if(this.props.authenticatedUser.user.pt){
            this.props.ptClearProfile();
        }
        else {
            this.props.clientClearProfile();
        }
        this.props.logOutUser();
        window.location.href='/';
    };

    render() {
        const {user ,isAuthenticated} = this.props.authenticatedUser;
        const {userData, ProfilePicUrl} = this.state;

        // Define navbar for dynamic navbar
        const authorisedLinks = (
            <div className="collapse navbar-collapse" id="mobile-navigation">
                <ul className="navbar-nav">
                    {
                        user.pt && userData && <PtMenuComp userData={userData}/>
                    }
                    {
                        !user.pt && userData && <ClientMenuComp userData={userData}/>
                    }
                    <li className="nav-item">
                        <a href="/" onClick={this.onLogOutClick} className="nav-link">
                            <ProfileImage image={ProfilePicUrl}/>
                                {/*{' '} is used to provide space */}
                                {' '}
                                {userData !== null ? userData.FullName : null}
                                {' '}
                                - Log Out
                        </a>
                    </li>
                </ul>
            </div>
        );


        const guestLinks = (
            <div className="collapse navbar-collapse guest" id="mobile-navigation">
                <ul className="navbar-nav mr-auto">
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
            <nav className="navbar navbar-expand-sm navbar-dark navbar-custom">
                <div className="navbar-container">
                    <Link className="navbar-brand" to={isAuthenticated ? '/users/' +
                        this.props.authenticatedUser.user.id + '/dashboard' : "/"}>
                        <img src={require('../../img/logo.jpg')} alt={"Fitness app logo"}></img>
                        Fitness App
                    </Link> {/*Using Link instead of anchor tag*/}
                    <button className="navbar-toggler ml-auto" type="button" data-target="#mobile-navigation" data-toggle="collapse">
                        <span className="navbar-toggler-icon ml-auto"></span>
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
export default connect(stateToProps, {
    logOutUser,
    clientGetData,
    clientClearProfile,
    ptGetData,
    ptClearProfile
})(withRouter(Navigation));
