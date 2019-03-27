import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {getClientData, editClientData, passwordsMatchError} from "../../actions/authenticationActions"; // Used to import create action for getting client data and editing client data
import {withRouter} from 'react-router-dom';
import FormInputGroup from "../common/FormInputGroup";
import Loading from "../../elements/Loading";
import isEmpty from "../../utilities/is_empty";
import ErrorComponent from "../error/ErrorComponent"; // Allows proper routing and linking using browsers match, location, and history properties

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
            DateOfBirth: '',
            Sex: '',
            Password: '',
            Password2: '',
            errors: {},
            location: this.props.location,
            loaded: false
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
                errors: props.errors,
                loaded: true
            }
        }
        if (props.errors !== state.errors) {
            return {errors: props.errors}
        }
        return null
    }

    componentDidMount() {
        document.body.scrollTo(0,0);
    }

    // This captures what the user types and sets the specific input to the respective state variable
    onChange(event) {
        // event.target.name is used instead of a specific named state (ie "event.target.FullName") as there is more then
        // one, making it easier to capture all of them with this onChange function.
        this.setState({[event.target.name]: event.target.value});
    }

    onSubmit(event) {
        event.preventDefault();

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

        if (dataChanged){
            errors.noData = "No data has been modified!";
            this.props.passwordsMatchError(errors);
            return null;
        }
        else if (this.state.Password !== this.state.Password2) {

            errors.Password = "Passwords must match";
            errors.Password2 = "Passwords must match";
            this.props.passwordsMatchError(errors);
        }
        else {

            this.props.editClientData(this.state.userId, editData, this.props.history);
            // if passwords match
            this.props.passwordsMatchError({})
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

            let {errors} = this.state;
            return (
                <div className="edit_client">
                    <div className="container  edit_client-custom">
                        <div className="row">
                            <div className="m-auto col-md-8">
                                <h1 className=" text-center display-5">Edit Profile</h1>
                                <form autoComplete="off" onSubmit={this.onSubmit}> {/* onSubmit used instead of normal action*/}
                                    <input type="hidden" value="something"/>
                                    <FormInputGroup
                                        name="FullName"
                                        placeholder={this.state.client_data.FullName}
                                        value={this.state.FullName === "" ? this.props.authenticatedUser.client_data.FullName : this.state.FullName}
                                        type="text"
                                        onChange={this.onChange}
                                        error={errors.FullName}
                                    />
                                    <FormInputGroup
                                        name="Email"
                                        placeholder={this.state.client_data.Email}
                                        value={this.state.Email === "" ? this.props.authenticatedUser.client_data.Email : this.state.Email}
                                        type="Email"
                                        onChange={this.onChange}
                                        error={errors.Email}
                                    />
                                    <FormInputGroup
                                        name="ContactNumber"
                                        placeholder={this.state.client_data.ContactNumber}
                                        value={this.state.ContactNumber === "" ? this.props.authenticatedUser.client_data.ContactNumber : this.state.ContactNumber}
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
                                        value={this.state.password}
                                        type="Password"
                                        onChange={this.onChange}
                                        error={errors.Password}
                                    />
                                    <FormInputGroup
                                        name="Password2"
                                        placeholder="Confirm Password"
                                        value={this.state.password2}
                                        type="Password"
                                        onChange={this.onChange}
                                        error={errors.Password2}
                                    />
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
    passwordsMatchError: PropTypes.func.isRequired,
    authenticatedUser: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

// Used to pull auth state and errors into this component.... DEFINED IN reducers/index.js {combineReducers}
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors
});

export default connect(stateToProps, {getClientData, editClientData, passwordsMatchError})(withRouter(EditClient));
