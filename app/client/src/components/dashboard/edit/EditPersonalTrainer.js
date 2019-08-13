import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {getPtData,  editPtData, passwordsMatchError, setErrors, clearErrors, setSuccess, clearSuccess} from "../../../actions/ptProfileActions"; // Used to import create action for getting pt data and editing pt data
import {withRouter} from 'react-router-dom';
import FormInputGroup from "../../common/FormInputGroup";
import Loading from "../../../elements/Loading";
import isEmpty from "../../../utilities/is_empty";
import ErrorComponent from "../../error/ErrorComponent"; // Allows proper routing and linking using browsers match, location, and history properties
import DisplayMessage from '../../common/DisplayMessage';
import FormSelectComp from "../../common/FormSelectComp";
import defaultUserImage from "../../../img/user-regular.svg";
import checkExp from "../../../utilities/checkExp";

class EditPersonalTrainer extends Component {
    // This allows the component states to be updated and re-rendered
    constructor(props) {
        super(props);
        this.state = {
            pt_data: undefined,
            FullName: '',
            Email: '',
            DateOfBirth: '',
            Sex: '',
            Password: '',
            Password2: '',
            values : [
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

        // This sets the state value to it's respective state (via binding)
        this.onChange = this.onChange.bind(this);

        // This binds the onSubmit function to this.OnSubmit
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        checkExp();
        if(this.props.ptProfile.pt_data === null){
            this.props.getPtData(this.props.history);
        }
        this.props.clearErrors();
        this.props.clearSuccess();
        document.body.scrollTo(0,0);
    }

    componentDidUpdate(){
        if(this.props.ptProfile.pt_data !== null && !this.state.updated){
            this.setState({
                FullName : this.props.ptProfile.pt_data.FullName,
                Email : this.props.ptProfile.pt_data.Email,
                Sex : this.props.ptProfile.pt_data.Sex,
                DateOfBirth: this.props.ptProfile.pt_data.DateOfBirth.substring(0, 10),
                updated : true
            })
        }
    }

    // Replacement for componentWillReceiveProps (as was depreciated)
    static getDerivedStateFromProps(props, state) {
        if (props.ptProfile.pt_data !== state.pt_data) {
            return {
                pt_data: props.ptProfile.pt_data,
                errors: props.errors,
                loaded: true
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

    componentWillUnmount(){

        this.props.clearErrors();
        this.props.clearSuccess();
    }

    // This captures what the user types and sets the specific input to the respective state variable
    onChange(event) {
        this.setState({[event.target.name]: event.target.value});

        if(!isEmpty(this.props.errors)){
            this.props.clearErrors();
        }
        this.setState({message: {type: null}}); // reset to null
        if(!isEmpty(this.props.success)){
            this.props.clearSuccess();
        }
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.clearSuccess();

        // Check if any data has been changed, don't want to waste server load and bandwidth on empty requests
        let dataChanged = false;
        // Set errors using spread operator on nested state (only calls setState once)
        let errors = {...this.state.errors};

        const editData = {
            FullName: this.state.FullName,
            Email: this.state.Email,
            //ProfilePicUrl: this.state.ProfilePicUrl,
            DateOfBirth: this.state.DateOfBirth,
            Sex: this.state.Sex,
            Password: this.state.Password,
            Password2: this.state.Password2
        };

        let pt_data = this.state.pt_data;

        // Check if any of the fields have been modified, break asap if one has, no need to continue loop.
        for(let element in editData) {
            // format DateOfBirth in pt_data for check
            if(element === "DateOfBirth"){
                pt_data[element] = pt_data[element].substring(0,10);
            }
            if(!isEmpty(editData[element]) && pt_data[element] !== editData[element]){
                dataChanged = true;
            }
            if (pt_data.hasOwnProperty(element)){
                pt_data[element] = editData[element];
            }
        }

        let message;

        if (!dataChanged){
            message = {
                type: "ERROR",
                msg: "No data has been modified!"
            };

            this.setState({message});
            this.props.setErrors(errors);
            return null;
        }
        else if (!(this.state.Password === this.state.Password2)) {
            errors.Password = "Passwords must match";
            errors.Password2 = "Passwords must match";
            this.props.passwordsMatchError(errors);
            return null;
        }
        else {
            // Reset state field to empty for error messages
            this.setState({
                FullName : this.state.FullName,
                Email : this.state.Email,
                DateOfBirth: this.state.DateOfBirth,
                Sex: this.state.Sex,
                Password: '',
                Password2: '',
                pt_data: pt_data
            });
            this.props.editPtData(editData, this.props.history);
            // Clear password match errors
            this.props.clearErrors()
        }
    }

    render() {
        // if loaded is false then return loading screen
        if (this.props.ptProfile.pt_data === null) {
            return <Loading myClassName="loading_container"/>
        }
        if(isEmpty(this.props.authenticatedUser.user)){
            return <ErrorComponent/>
        }
        else{
            const {errors, message} = this.state; // This allows errors to be pulled out of this.state without pulling them out directly

            return (
                <div className="edit_client">
                    <div className="container  edit_client-custom">
                        <div className="row">
                            <div className="m-auto col-md-8">
                                <h1 className=" text-center display-5">Edit Personal Trainer Profile</h1>
                                <div className="edit_image">
                                    {(<img
                                        className = "rounded-circle"
                                        alt={this.props.ptProfile.pt_data.ProfilePicUrl === "NA" ? "Default user image." : "User profile picture."}
                                        src = {this.props.ptProfile.pt_data.ProfilePicUrl === "NA" ? defaultUserImage : defaultUserImage}
                                    />)}
                                </div>
                                <form autoComplete="off" onSubmit={this.onSubmit}>
                                    {/*// Deals with Chromes password auto complete*/}
                                    <input type="password" style={{height: 0, width: 0, opacity: 0, padding: 0, border: "none"}}></input>
                                    <FormInputGroup
                                        myClassName="edit-pt"
                                        name="FullName"
                                        placeholder={this.props.ptProfile.pt_data.FullName}
                                        value={this.state.FullName}
                                        type="text"
                                        onChange={this.onChange}
                                        error={errors.FullName}
                                    />
                                    <FormInputGroup
                                        myClassName="edit-pt"
                                        name="Email"
                                        placeholder={this.props.ptProfile.pt_data.Email}
                                        value={this.state.Email}
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
                                                value={this.state.DateOfBirth.toString()}
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
                                                values={this.state.values}
                                                onChange={this.onChange}
                                                error={errors.Sex}
                                            />
                                        </div>
                                    </div>
                                    <FormInputGroup
                                        myClassName="edit-pt"
                                        name="Password"
                                        placeholder="Enter Password"
                                        value={this.state.Password}
                                        type="Password"
                                        onChange={this.onChange}
                                        error={errors.Password}
                                    />
                                    <FormInputGroup
                                        name="Password2"
                                        placeholder="Confirm Password"
                                        value={this.state.Password2}
                                        type="Password"
                                        onChange={this.onChange}
                                        error={errors.Password2}
                                    />
                                    <DisplayMessage message={message}/>
                                    <input type="submit" value="Update" className="btn btn-info btn-block mt-1"/>
                                    <button type="button" className="btn btn-danger btn-block mt-3 mb-3" onClick={this.props.history.goBack}>Back</button>
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
    getPtData: PropTypes.func.isRequired,
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

export default connect(stateToProps, {getPtData, editPtData, passwordsMatchError, setErrors, clearErrors, setSuccess, clearSuccess})(withRouter(EditPersonalTrainer));
