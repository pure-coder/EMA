import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {getClientData, editClientData, passwordsMatchError} from "../../actions/authenticationActions"; // Used to import create action for getting client data and editing client data
import {withRouter} from 'react-router-dom';
import FormInputGroup from "../common/FormInputGroup";
import Loading from "../../elements/Loading"; // Allows proper routing and linking using browsers match, location, and history properties

class EditClient extends Component {
    // This allows the component states to be updated and re-rendered
    constructor(props) {
        super(props);
        this.state = {
            client_data: {
                password2: ''
            },
            FullName: '',
            Email: '',
            ContactNumber: '',
            DateOfBirth: '',
            Sex: '',
            Password: '',
            Password2: '',
            clientId: props.authenticatedUser.clientId,
            errors: {}
        };

        // This sets the state value to it's respective state (via binding)
        this.onChange = this.onChange.bind(this);

        // This binds the onSubmit function to this.OnSubmit
        this.onSubmit = this.onSubmit.bind(this);
    }

    // Populate state data with data from the database for the client
    static getDerivedStateFromProps(props, state) {
        if (props.authenticatedUser.client_data !== state.client_data) {
            return {client_data: props.authenticatedUser.client_data}
        }
        if (props.errors !== state.errors) {
            return {errors: props.errors}
        }
        return null
    }

    componentDidMount() {// If direct url used... didn't come through dashboard, ie bookmarked url, get uid from url
        // Check if isAuthenticated is true then redirect to the dashboard
        if (!this.props.authenticatedUser.isAuthenticated) {
            this.props.history.push('/login');
        }

        // if there is no data for user display get data or display error page
        if (this.state.client_data === undefined) {
            this.update();
        }
    }

    update() {
        // If clientId is undefined as explained above use url uid
        if (!this.props.authenticatedUser.clientId) {
            this.props.getClientData(this.props.match.params.uid, this.props.history);
        }
        else {
            this.props.getClientData(this.state.clientId, this.props.history);
        }
    }

    // This captures what the user types and sets the specific input to the respective state variable
    onChange(event) {
        // event.target.name is used instead of a specific named state (ie "event.target.FullName") as there is more then
        // one, making it easier to capture all of them with this onChange function.
        this.setState({[event.target.name]: event.target.value});
    }

    onSubmit(event) {
        event.preventDefault();

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

        if (this.state.Password === this.state.Password2) {
            this.props.editClientData(this.props.match.params.uid, editData);
            // if passwords match
            this.props.passwordsMatchError({errors: {}})
        }
        else {
            // Set state with separate calls on nested state
            // this.setState({errors: {Password: "Passwords must match"}});
            // this.setState({errors: {Password2: "Passwords must match"}});

            // // Set errors using spread operator on nested state (only calls setState once)
            let errors = {...this.state.errors};
            errors.Password = "Passwords must match";
            errors.Password2 = "Passwords must match";
            this.props.passwordsMatchError(errors);
        }
    }

    render() {
        const {errors} = this.state; // This allows errors to be pulled out of this.state without pulling them out directly

        // if loaded is false then return loading screen
        if (this.state.client_data === undefined) {
            return <Loading/>;
        }

        return (
            <div className="edit_client">
                <div className="container  edit_client-custom">
                    <div className="row">
                        <div className="m-auto col-md-8">
                            <h1 className=" text-center display-5">Edit Profile</h1>
                            <form onSubmit={this.onSubmit}> {/* onSubmit used instead of normal action*/}
                                <FormInputGroup
                                    name="FullName"
                                    placeholder={this.state.client_data.FullName}
                                    value={this.state.FullName}
                                    type="text"
                                    onChange={this.onChange}
                                    error={errors.FullName}
                                />
                                <FormInputGroup
                                    name="Email"
                                    placeholder={this.state.client_data.Email}
                                    value={this.state.Email}
                                    type="Email"
                                    onChange={this.onChange}
                                    error={errors.Email}
                                />
                                <FormInputGroup
                                    name="ContactNumber"
                                    placeholder={this.state.client_data.ContactNumber}
                                    value={this.state.ContactNumber}
                                    type="text"
                                    onChange={this.onChange}
                                    error={errors.ContactNumber}
                                />
                                <div className="form-group edit-profile-date-div">
                                    <label className="control-label form-control-lg edit-profile-label">Date of
                                        Birth:</label>
                                    <div className="edit-date-div">
                                        <input className='form-control form-control-lg' name="DateOfBirth"
                                               onChange={this.onChange} type="Date"/>
                                    </div>
                                    <label
                                        className="control-label form-control-lg edit-profile-label gender">Gender:</label>
                                    <div className="edit-date-div">
                                        <select name="Sex" onChange={this.onChange} className='form-control
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
                                <input type="submit" value="update" className="btn btn-info btn-block mt-5"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// Documents what props are needed for this component and will log a warning in the console in dev mode if not complied to
EditClient.propTypes = {
    getClientData: PropTypes.func.isRequired,
    passwordsMatchError: PropTypes.func.isRequired,
    authenticatedUser: PropTypes.object.isRequired,
    //errors: PropTypes.object.isRequired
};

// Used to pull auth state and errors into this component.... DEFINED IN reducers/index.js {combineReducers}
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors
});

export default connect(stateToProps, {getClientData, editClientData, passwordsMatchError})(withRouter(EditClient));
