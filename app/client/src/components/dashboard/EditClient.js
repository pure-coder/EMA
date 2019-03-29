import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {getClientData, editClientData, passwordsMatchError, setErrors, setSuccess} from "../../actions/authenticationActions"; // Used to import create action for getting client data and editing client data
import {withRouter} from 'react-router-dom';
import FormInputGroup from "../common/FormInputGroup";
import Loading from "../../elements/Loading";
import isEmpty from "../../utilities/is_empty";
import ErrorComponent from "../error/ErrorComponent"; // Allows proper routing and linking using browsers match, location, and history properties

import SuccessOrError from '../common/SuccessOrError';

class EditClient extends Component {
    // This allows the component states to be updated and re-rendered
    constructor(props) {
        super(props);
        this.state = {
            client_data: undefined,
            clientId: props.authenticatedUser.clientId !== undefined ? props.authenticatedUser.clientId : props.match.params.cid,
            userId: props.authenticatedUser.user.id,
            FullName: '',
            Email: '',
            ContactNumber: '',
            Password: '',
            Password2: '',
            errors: {},
            location: this.props.location,
            success: {},
            loaded: false,
            message: null, // Set to null so null is returned from SuccessOrError by default
        };

        this.props.getClientData(this.state.clientId, this.props.history);

        // This sets the state value to it's respective state (via binding)
        this.onChange = this.onChange.bind(this);

        // This binds the onSubmit function to this.OnSubmit
        this.onSubmit = this.onSubmit.bind(this);
    }

    // Populate state data with data from the database for the client
    static getDerivedStateFromProps(props, state) {
        if (props.authenticatedUser.client_data !== state.client_data) {
            return {
                client_data: props.authenticatedUser.client_data,
                success: props.success,
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
        // if (props.errors !== state.errors) {
        //     return {errors: props.errors}
        // }
        return null
    }

    componentDidMount() {
        document.body.scrollTo(0,0);
    }

    componentWillUnmount(){
        this.props.setErrors();
        this.props.setSuccess();
    }

    // This captures what the user types and sets the specific input to the respective state variable
    onChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    onSubmit(event) {
        event.preventDefault();
        this.setState({message: null}); // reset to null

        // Check if any data has been changed, don't want to waste server load and bandwidth on empty requests
        let dataChanged = false;
        // Set errors using spread operator on nested state (only calls setState once)
        let errors = {...this.state.errors};

        const editData = {
            FullName: this.state.FullName,
            Email: this.state.Email,
            ContactNumber: this.state.ContactNumber,
            //ProfilePicUrl: this.state.ProfilePicUrl,
            DateOfBirth: this.state.DateOfBirth,
            Sex: this.state.Sex,
            Password: this.state.Password,
            Password2: this.state.Password2
        };

        // Check if any of the fields have been modified, break as soon asap if one has, no need to continue loop.
        for(let element in editData) {
            if(!isEmpty(editData[element])){
                dataChanged = true;
                break;
            }
        }

        if (!dataChanged){
            this.setState({message: "No data has been modified!"});
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
            // reset state fields to empty for error messages
            this.setState({
                FullName: '',
                Email: '',
                ContactNumber: '',
                Password: '',
                Password2: '',
                message: "Client profile has been updated."
            });
            this.props.editClientData(this.state.clientId, editData, this.props.history);
            // Clear password match errors
            this.props.setErrors();
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
        else {
            let {errors, message} = this.state;
            return (
                <div className="edit_client">
                    <div className="container  edit_client-custom">
                        <div className="row">
                            <div className="m-auto col-md-8">
                                <h1 className=" text-center display-5">Edit Client Profile</h1>
                                <form autoComplete="off" onSubmit={this.onSubmit}>
                                    {/*// Deals with Chromes password auto complete*/}
                                    <input type="password" style={{height: 0, width: 0, opacity: 0, padding: 0, border: "none"}}></input>
                                    <FormInputGroup
                                        name="FullName"
                                        placeholder={this.state.client_data.FullName}
                                        value={this.state.FullName === '' ? this.state.client_data.FullName : this.state.FullName}
                                        type="text"
                                        onChange={this.onChange}
                                        error={errors.FullName}
                                    />
                                    <FormInputGroup
                                        name="Email"
                                        placeholder="Email"
                                        value={this.state.Email === '' ? this.state.client_data.Email : this.state.Email}
                                        type="Email"
                                        onChange={this.onChange}
                                        error={errors.Email}
                                    />
                                    <FormInputGroup
                                        name="ContactNumber"
                                        placeholder="ContactNumber"
                                        value={this.state.ContactNumber === '' ? this.state.client_data.ContactNumber : this.state.ContactNumber}
                                        type="text"
                                        onChange={this.onChange}
                                        error={errors.ContactNumber}
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
                                        value={this.state.Password}
                                        type="password"
                                        onChange={this.onChange}
                                        error={errors.Password}
                                    />
                                    <FormInputGroup
                                        name="Password2"
                                        placeholder="Confirm Password"
                                        value={this.state.Password2}
                                        type="password"
                                        onChange={this.onChange}
                                        error={errors.Password2}
                                    />
                                    <SuccessOrError msg={message}/>
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
EditClient.propTypes = {
    getClientData: PropTypes.func.isRequired,
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

export default connect(stateToProps, {getClientData, editClientData, passwordsMatchError, setErrors, setSuccess})(withRouter(EditClient));
