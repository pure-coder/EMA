import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {withRouter} from 'react-router-dom';
import isEmpty from '../../utilities/is_empty';
import Loading from "../../elements/Loading";
import ErrorComponent from "../error/ErrorComponent";

class UserInfo extends Component {
    // This allows the component states to be up{dated and re-rendered)
    constructor(props) {
        // initiate props this clients
        super(props);
        this.state = {
            userData : props.userData,
            errors: {},
            location: this.props.location.pathname,
            loaded: false
        }
    }

    // Set clients in state to those retrieved from database (from props), as on refresh state clients will always be undefined
    static getDerivedStateFromProps(props, state) {
        if (props.userData !== state.userData) {
            return {
                userData: props.userData,
                errors: props.errors,
                loaded: true
            }
        }
        return null
    }

    render() {
        if (!this.state.loaded) {
            return <Loading/>
        }
        if (isEmpty(this.props.authenticatedUser.user)) {
            return <ErrorComponent/>
        }
        else {
            let displayContent;

            // Define content to display.. in this case the list of clients
            displayContent = (
                // send clients data to client component, and render client component
                <div className="userInfo-custom">
                    {/*<h1>User info here</h1>*/}
                    {(<p>{this.props.userData.FullName}</p>)}
                </div>
            );

            return (
                <div className="userInfo-container">
                    {displayContent}
                </div>
            );
        } // else
    } // render
}

// Documents what props are needed for this component and will log a warning in the console in dev mode if not complied to
UserInfo.propTypes = {
    authenticatedUser: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

// Used to pull auth state and errors into this component.... DEFINED IN reducers/index.js {combineReducers} !!!! USED FOR THE REDUX STORE
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser, // authenticatedUser is set in index.js file in the reducers folder
    errors: state.errors, // errors is set in index.js file in the reducers folder
    location: state.location
});

export default connect(stateToProps, {})(withRouter(UserInfo));
