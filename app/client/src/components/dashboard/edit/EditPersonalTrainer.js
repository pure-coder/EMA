import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {
    ptGetData,
    ptEditData,
    passwordsMatchError,
    setErrors,
    clearErrors,
    setSuccess,
    ptDeleteAccount,
    clearSuccess
} from "../../../actions/ptProfileActions"; // Used to import create action for getting pt data and editing pt data
import {withRouter} from 'react-router-dom';
import FormInputGroup from "../../common/Forms/FormInputGroup";
import Loading from "../../common/Loading/Loading";
import isEmpty from "../../../utilities/is_empty";
import ErrorComponent from "../../error/ErrorComponent"; // Allows proper routing and linking using browsers match, location, and history properties
import DisplayMessage from '../../common/Message/DisplayMessage';
import FormSelectComp from "../../common/Forms/FormSelectComp";
import checkExp from "../../../utilities/checkExp";
import {Link} from 'react-router-dom';
import {ProfileImage} from "../profile/ProfileImage";

class EditPersonalTrainer extends Component {
    // This allows the component states to be updated and re-rendered
    constructor(props) {
        super(props);
        this.state = {
            pt_data: null,
            FullName: '',
            Email: '',
            DateOfBirth: '',
            profilePicture: null,
            Sex: '',
            Password: '',
            Password2: '',
            Values : [
                "Male",
                "Female"
            ],
            ptId: props.authenticatedUser.user.id,
            errors: {},
            success: {},
            location: this.props.location,
            loaded: true,
            updated: false,
            message: {
                type: null
            } // Set to null so null is returned from DisplayMessage by default
        };
    }

    // Replacement for componentWillReceiveProps (as was depreciated)
    static getDerivedStateFromProps(props, state) {
        if(!isEmpty(state.errors)){
            return {
                errors: state.errors
            }
        }
        if(isEmpty(props.success) !== isEmpty(state.success)){
            return {
                message: props.success
            }
        }
        if(isEmpty(props.errors) !== isEmpty(state.errors)){
            return {
                errors: props.errors
            }
        }
        return null
    }

    componentDidMount() {
        const {isAuthenticated} = this.props.authenticatedUser;
        if(!isAuthenticated)
            this.props.history.push('/login');
        checkExp();
        this.props.ptGetData(this.props.history);
        this.props.clearErrors();
        this.props.clearSuccess();
        document.body.scrollTo(0,0);
    }

    componentDidUpdate(){
        if(this.props.ptProfile.pt_data !== null && !this.state.updated){
            this.setState({
                FullName : this.props.ptProfile.pt_data.FullName,
                profilePicture: this.props.ptProfile.pt_data.ProfilePicUrl,
                Email : this.props.ptProfile.pt_data.Email,
                Sex : this.props.ptProfile.pt_data.Sex,
                DateOfBirth: this.props.ptProfile.pt_data.DateOfBirth.substring(0, 10),
                updated : true
            })
        }
        if(this.state.pt_data === null && this.props.ptProfile.pt_data !== null){
            this.setState({pt_data: this.props.ptProfile.pt_data});
        }
    }

    componentWillUnmount(){
        this.props.clearErrors();
        this.props.clearSuccess();
    }

    // This captures what the user types and sets the specific input to the respective state variable
    onChange = event => {
        const {name, value} = event.target;

        if(name === "FullName" && value.length > 25){
            this.setState({
                errors: {
                    FullName: "Full Name must be less than 25 characters."
                }
            });
            return null
        }

        this.setState({
            [name]: value,
            message: {},
            errors: {}
        });

        if(!isEmpty(this.props.errors)){
            this.props.clearErrors();
        }
        if(!isEmpty(this.props.success)){
            this.props.clearSuccess();
        }
    };

    onSubmit = event => {
        event.preventDefault();
        this.props.clearSuccess();

        // Check if any data has been changed, don't want to waste server load and bandwidth on empty requests
        let dataChanged = false;
        // Set errors using spread operator on nested state (only calls setState once)
        let errors = {...this.state.errors};
        const {pt_data, FullName, DateOfBirth, Email, Sex, Password, Password2} = this.state;

        const editData = {
            FullName: FullName,
            Email: Email,
            DateOfBirth: DateOfBirth,
            Sex: Sex,
            Password: Password,
            Password2: Password2
        };

        Object.keys(editData).forEach(key =>{
            // format DateOfBirth in pt_data for check
            if(key === "DateOfBirth"){
                pt_data[key] = pt_data[key].substring(0,10);
            }
            if(!isEmpty(editData[key]) && pt_data[key] !== editData[key]){
                dataChanged = true;
            }
            if (pt_data.hasOwnProperty(key)){
                pt_data[key] = editData[key];
            }
        });

        if (!dataChanged){

            this.setState({
                message: {
                    type: "ERROR",
                    msg: "No data has been modified!"
                }
            });
            this.props.setErrors(errors);
            return null;
        }
        else if (!(Password === Password2)) {
            errors.Password = "Passwords must match";
            errors.Password2 = "Passwords must match";
            this.props.passwordsMatchError(errors);
            return null;
        }
        else {
            this.props.ptEditData(editData, this.props.history);
            // Clear password match errors
            this.props.clearErrors()
        }
    };

    deleteAccount = () => {
        this.props.ptDeleteAccount();
    };

    render() {
        // if loaded is false then return loading screen
        const {pt_data} = this.props.ptProfile;
        if (pt_data === null) {
            return <Loading myClassName="loading_container"/>
        }
        if(isEmpty(this.props.authenticatedUser.user)){
            return <ErrorComponent/>
        }
        else{
            const {errors, message, profilePicture, FullName, Email, DateOfBirth, Values, Password, Password2} = this.state; // This allows errors to be pulled out of this.state without pulling them out directly

            return (
                <div className="edit_client">
                    <div className="container  edit_client-custom">
                        <div className="row">
                            <div className="m-auto col-md-8">
                                <h1 className=" text-center display-5">Edit Personal Trainer Profile</h1>
                                <div className="edit_image">
                                    <Link to={`upload_profile_picture`}>
                                        <ProfileImage image={profilePicture} />
                                        <h5>Upload Picture</h5>
                                    </Link>
                                </div>
                                <form autoComplete="off" onSubmit={this.onSubmit}>
                                    {/*// Deals with Chromes password auto complete*/}
                                    <input type="password" style={{height: 0, width: 0, opacity: 0, padding: 0, border: "none"}}></input>
                                    <FormInputGroup
                                        myClassName="edit-pt"
                                        name="FullName"
                                        placeholder={FullName}
                                        value={FullName}
                                        type="text"
                                        onChange={this.onChange}
                                        error={errors.FullName}
                                    />
                                    <FormInputGroup
                                        myClassName="edit-pt"
                                        name="Email"
                                        placeholder={Email}
                                        value={Email}
                                        type="Email"
                                        onChange={this.onChange}
                                        error={errors.Email}
                                    />
                                    <div className="form-group edit-profile-date-div">
                                        <div className="edit-date-div">
                                            <label className="control-label form-control-lg edit-profile-label">Date of
                                                Birth:
                                            </label>
                                            < FormInputGroup
                                                myClassName="edit-exercise"
                                                name="DateOfBirth"
                                                value={DateOfBirth.toString()}
                                                type="date"
                                                onChange={this.onChange}
                                                error={errors.DateOfBirth}
                                            />
                                        </div>
                                        <div className="edit-gender-div">
                                            <label
                                                className="control-label form-control-lg edit-profile-label gender">
                                                Gender:
                                            </label>
                                            <FormSelectComp
                                                name="Sex"
                                                id="Sex"
                                                values={Values}
                                                onChange={this.onChange}
                                                error={errors.Sex}
                                            />
                                        </div>
                                    </div>
                                    <FormInputGroup
                                        myClassName="edit-pt"
                                        name="Password"
                                        placeholder="Enter Password"
                                        value={Password}
                                        type="Password"
                                        onChange={this.onChange}
                                        error={errors.Password}
                                    />
                                    <FormInputGroup
                                        name="Password2"
                                        placeholder="Confirm Password"
                                        value={Password2}
                                        type="Password"
                                        onChange={this.onChange}
                                        error={errors.Password2}
                                    />
                                    <DisplayMessage message={message}/>
                                    <input type="submit" value="Update" className="btn btn-info btn-block mt-1"/>
                                    <button type="button" className="btn btn-success btn-block mt-3 mb-3" onClick={this.props.history.goBack}>Back</button>
                                    <button type="button" className="btn btn-danger btn-block mt-3 mb-3" onClick={this.deleteAccount}>Delete Account</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

// Documents what props are needed for this component and will log a warning in the console in dev mode if not complied to
EditPersonalTrainer.propTypes = {
    ptGetData: PropTypes.func.isRequired,
    ptDeleteAccount: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    setErrors: PropTypes.func.isRequired,
    setSuccess: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired,
    passwordsMatchError: PropTypes.func.isRequired,
    authenticatedUser: PropTypes.object.isRequired,
    ptProfile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    success: PropTypes.object.isRequired,
};

// Used to pull auth state and errors into this component.... DEFINED IN reducers/index.js {combineReducers}
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    ptProfile: state.ptProfile,
    errors: state.errors,
    success: state.success
});

export default connect(stateToProps, {ptGetData,
    ptEditData,
    passwordsMatchError,
    setErrors,
    clearErrors,
    setSuccess,
    clearSuccess,
    ptDeleteAccount
})(withRouter(EditPersonalTrainer));
