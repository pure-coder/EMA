import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {withRouter} from 'react-router-dom';
import isEmpty from '../../../utilities/is_empty';
import Loading from "../../../elements/Loading";
import ErrorComponent from "../../error/ErrorComponent";
import defaultUserImage from '../../../img/user-regular.svg';

class UserInfo extends Component {

    static getAge(dateOfBirth){
        let DOB = new Date(dateOfBirth).getTime();
        DOB = Date.now() - DOB;
        let age = new Date(DOB);
        return Math.abs(age.getFullYear() - 1970);
    }

    render() {
        if (this.props.userData === null) {
            return <Loading myClassName="loading_container"/>
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
                            alt={this.props.userData.ProfilePicUrl === "NA" ? "Default user image." : "User profile picture."}
                            src = {this.props.userData.ProfilePicUrl === "NA" ? defaultUserImage : defaultUserImage}
                        />)}
                    </div>
                    <div className="user_data">
                        <p>Name: <span className="data text-primary">{this.props.userData.FullName}</span></p><br/>
                        <p>Email: <span className="data text-primary">{this.props.userData.Email}</span></p><br/>
                        {this.props.userData.ContactNumber ? <p>Contact: <span className="data text-primary">{this.props.userData.ContactNumber}</span></p> : null}
                        {this.props.userData.ContactNumber ? <br/> : null} {/* had to add conditional statement for break as won't let me use in statement above with other tags */}
                        <p>Gender: <span className="data text-primary">{this.props.userData.Sex}</span></p><br/>
                        <p>Age: <span className="data text-primary">{UserInfo.getAge(this.props.userData.DateOfBirth)}</span></p><br/>
                    </div>
                </div>
            );

            return (
                <div className="row">
                    <div className="userInfo-container">
                        {displayContent}
                    </div>
                </div>
            );
        } // else
    } // render
}

// Documents what props are needed for this component and will log a warning in the console in dev mode if not complied to
UserInfo.propTypes = {
    authenticatedUser: PropTypes.object.isRequired,
    ptProfile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

// Used to pull auth state and errors into this component.... DEFINED IN reducers/index.js {combineReducers} !!!! USED FOR THE REDUX STORE
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser, // authenticatedUser is set in index.js file in the reducers folder
    ptProfile: state.ptProfile,
    errors: state.errors, // errors is set in index.js file in the reducers folder
    location: state.location
});

export default connect(stateToProps, {})(withRouter(UserInfo));
