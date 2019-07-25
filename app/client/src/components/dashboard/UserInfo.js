import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {withRouter} from 'react-router-dom';
import isEmpty from '../../utilities/is_empty';
import Loading from "../../elements/Loading";
import ErrorComponent from "../error/ErrorComponent";
import defaultUserImage from '../../img/user-regular.svg';

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
        if (props.userData !== state.userData || state.userData !== undefined) {
            return {
                userData: props.userData,
                errors: props.errors,
                loaded: true
            }
        }
        return null
    }

    componentDidMount(){
    }

    getAge(dateOfBirth){
        let DOB = new Date(dateOfBirth).getTime();
        DOB = Date.now() - DOB;
        let age = new Date(DOB);
        return Math.abs(age.getFullYear() - 1970);
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
                    <div className="user_image">
                        {(<img
                            className = "rounded-circle"
                            alt={this.state.userData.ProfilePicUrl === "NA" ? "Default user image." : "User profile picture."}
                            src = {this.state.userData.ProfilePicUrl === "NA" ? defaultUserImage : defaultUserImage}
                        />)}
                    </div>
                    {(<p>Name: {this.state.userData.FullName}</p>)}
                    {(<p>Email: {this.state.userData.Email}</p>)}
                    {(<p>Gender: {this.state.userData.Sex}</p>)}
                    {(<p>Age: {this.getAge(this.state.userData.DateOfBirth)}</p>)}
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
