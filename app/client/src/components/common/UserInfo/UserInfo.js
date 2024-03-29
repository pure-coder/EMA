import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {withRouter} from 'react-router-dom';
import isEmpty from '../../../utilities/is_empty';
import Loading from "../Loading/Loading";
import ErrorComponent from "../../error/ErrorComponent";
import defaultUserImage from '../../../img/user-regular.svg';
import {ProfileImage} from "../ProfileImage/ProfileImage";

class UserInfo extends Component {
    constructor(props){
        super(props);
        this.state = {
            ProfilePicUrl: defaultUserImage
        }
    }


    static getAge(dateOfBirth){
        let DOB = new Date(dateOfBirth).getTime();
        DOB = Date.now() - DOB;
        let age = new Date(DOB);
        return Math.abs(age.getFullYear() - 1970);
    }

    render() {
        const {userData} = this.props;
        if (userData === null) {
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
                        <ProfileImage image={userData.ProfilePicUrl}/>
                    </div>
                    <div className="user_data">
                        <p>Name: <span className="data text-primary">{userData.FullName}</span></p><br/>
                        <p>Email: <span className="data text-primary">{userData.Email}</span></p><br/>
                        {userData.ContactNumber ? <p>Contact: <span className="data text-primary">{userData.ContactNumber}</span></p> : null}
                        {userData.ContactNumber ? <br/> : null} {/* had to add conditional statement for break as won't let me use in statement above with other tags */}
                        <p>Gender: <span className="data text-primary">{userData.Sex}</span></p><br/>
                        <p>Age: <span className="data text-primary">{UserInfo.getAge(userData.DateOfBirth)}</span></p><br/>
                    </div>
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
