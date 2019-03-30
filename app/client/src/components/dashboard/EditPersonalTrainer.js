import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {getPtData,  editPtData, passwordsMatchError, setErrors, setSuccess} from "../../actions/authenticationActions"; // Used to import create action for getting pt data and editing pt data
import {withRouter} from 'react-router-dom';
import FormInputGroup from "../common/FormInputGroup";
import Loading from "../../elements/Loading";
import isEmpty from "../../utilities/is_empty";
import ErrorComponent from "../error/ErrorComponent"; // Allows proper routing and linking using browsers match, location, and history properties

import DisplayMessage from '../common/DisplayMessage';

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
            ptId: props.authenticatedUser.user.id,
            errors: {},
            success: {},
            location: this.props.location,
            loaded: false,
            message: {
                type: null
            } // Set to null so null is returned from DisplayMessage by default
        };

        this.props.getPtData(this.state.ptId, this.props.history);

        // This sets the state value to it's respective state (via binding)
        this.onChange = this.onChange.bind(this);

        // This binds the onSubmit function to this.OnSubmit
        this.onSubmit = this.onSubmit.bind(this);
    }

    // Populate state data with data from the database for the pt
    static getDerivedStateFromProps(props, state) {
        if (props.authenticatedUser.pt_data !== state.pt_data) {
            return {
                pt_data: props.authenticatedUser.pt_data,
                errors: props.errors,
                loaded: true
            }
        }
        if(props.success !== state.success || props.errors !== state.errors){
            return {
                success: props.success,
                errors: props.errors
            }
        }
        return null
    }

    componentDidMount() {
        document.body.scrollTo(0,0);
    }

    componentWillUnmount(){
        this.props.setErrors({});
        this.props.setSuccess({});
    }

    // This captures what the user types and sets the specific input to the respective state variable
    onChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    onSubmit(event) {
        event.preventDefault();
        this.setState({message: {type: null}}); // reset to null

        // Check if any data has been changed, don't want to waste server load and bandwidth on empty requests
        let dataChanged = false;
        // Set errors using spread operator on nested state (only calls setState once)
        let errors = {...this.state.errors};

        const editData = {
            FullName: this.state.FullName,
            Email: this.state.Email,
            //ProfilePicUrl: this.state.ProfilePicUrl,
            Sex: this.state.Sex,
            Password: this.state.Password,
            Password2: this.state.Password2
        };

        for(let element in editData) {
            if(!isEmpty(editData[element])){
                dataChanged = true;
                break;
            }
        }

        let message;
        let merge;

        if (!dataChanged){
            message = {
                type: "error",
                msg: "No data has been modified!"
            };

            merge = Object.assign(this.state.message, message);
            this.setState({message: merge});
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
            message = {
                type: "success",
                msg: "Personal Trainer profile has been updated."
            };

            merge = Object.assign(this.state.message, message);

            // Reset state field to empty for error messages
            this.setState({
                FullName: '',
                Email: '',
                DateOfBirth: '',
                Sex: '',
                Password: '',
                Password2: '',
                message: merge
            });
            this.props.editPtData(this.state.ptId, editData, this.props.history);
            // Clear password match errors
            this.props.setErrors()
        }
    }

    render() {
        // if loaded is false then return loading screen
        if (!this.state.loaded) {
            return <Loading/>;
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
                                <form autoComplete="off" onSubmit={this.onSubmit}>
                                    {/*// Deals with Chromes password auto complete*/}
                                    <input type="password" style={{height: 0, width: 0, opacity: 0, padding: 0, border: "none"}}></input>
                                    <FormInputGroup
                                        name="FullName"
                                        placeholder={this.state.pt_data.FullName}
                                        value={this.state.FullName === '' ? this.state.pt_data.FullName : this.state.FullName}
                                        type="text"
                                        onChange={this.onChange}
                                        error={errors.FullName}
                                    />
                                    <FormInputGroup
                                        name="Email"
                                        placeholder={this.state.pt_data.Email}
                                        value={this.state.Email === '' ? this.state.pt_data.Email : this.state.Email}
                                        type="Email"
                                        onChange={this.onChange}
                                        error={errors.Email}
                                    />
                                    <div className="form-group edit-profile-date-div">
                                        <div className="edit-date-div">
                                            <label className="control-label form-control-lg edit-profile-label">Date of
                                                Birth:
                                            </label>
                                            <input className='form-control form-control-lg date-input' name="DateOfBirth"
                                                   onChange={this.onChange} type="Date"/>
                                        </div>
                                        <div className="edit-gender-div">
                                            <label
                                                className="control-label form-control-lg edit-profile-label gender">
                                                Gender:
                                            </label>
                                            <select name="Sex" onChange={this.onChange} id="Sex" className='form-control
                                            form-control-lg'>
                                                <option value="">Please select</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                    </div>
                                    <FormInputGroup
                                        name="Password"
                                        placeholder="Enter Password"
                                        value={this.state.password}
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
                                    <input type="submit" value="Update" className="btn btn-info btn-block mt-4"/>
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
    setErrors: PropTypes.func.isRequired,
    setSuccess: PropTypes.func.isRequired,
    passwordsMatchError: PropTypes.func.isRequired,
    authenticatedUser: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

// Used to pull auth state and errors into this component.... DEFINED IN reducers/index.js {combineReducers}
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors,
    success: state.success
});

export default connect(stateToProps, {getPtData, editPtData, passwordsMatchError, setErrors, setSuccess})(withRouter(EditPersonalTrainer));
