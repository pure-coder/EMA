import React, { Component } from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import { connect } from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import { getClientData, editClientData } from "../../actions/authenticationActions"; // Used to import create action for getting client data and editing client data
import { withRouter } from 'react-router-dom';
import FormInputGroup from "../common/FormInputGroup"; // Allows proper routing and linking using browsers match, location, and history properties

class EditClient extends Component {
    // This allows the component states to be updated and re-rendered
    constructor(props) {
        super(props);
        this.state = {
            FullName: '',
            Email: '',
            ContactNumber: '',
            ProfilePicUrl: '',
            Sex: '',
            Password: '',
            Password2: '',
            errors: {}
        };

        // This sets the state value to it's respective state (via binding)
        this.onChange = this.onChange.bind(this);

        // This binds the onSubmit function to this.OnSubmit
        this.onSubmit = this.onSubmit.bind(this);
    }

    // Life cycle method for react which will run when this component receives new properties
    componentWillReceiveProps(nextProps) {
        // If property (nextProps) contains errors (contains the "errors" prop) then set the component state of errors
        // defined in the constructor above to the errors that was sent to it via the dispatch call from
        // authenicationActions.js
        if(nextProps.errors){
            this.setState({errors: nextProps.errors})
        }
    }

    // This captures what the user types and sets the specific input to the respective state variable
    onChange(event) {
        // event.target.name is used instead of a specific named state (ie "event.target.FullName") as there is more then
        // one, making it easier to capture all of them with this onChange function.
        this.setState({[event.target.name]: event.target.value})
    }

    onSubmit(event) {
        event.preventDefault();

        const editData = {
            FullName: this.state.FullName,
            Email: this.state.Email,
            ContactNumber: this.state.ContactNumber,
            ProfilePicUrl: this.state.ProfilePicUrl,
            Sex: this.state.Sex,
            Password: this.state.Password,
            Password2: this.state.Password2
        };

        // Calls the action/reducer loginUser with the user data as well
        // as using the history function of withRouter for directing user to another link/route. (calls registerUser
        // from actions/authenticationActions.js)

        // If no errors occur then register user
        this.props.editClientData(editData, this.props.history);
    }

    render() {
        const {errors} = this.state; // This allows errors to be pulled out of this.state with pulling them out directly

        return (
            <div className="edit_client">
                <div className="container  edit_client-custom">
                    <div className="row">
                        <div className="m-auto col-md-8">
                            <h1 className=" text-center display-5">Edit Profile</h1>
                            <p className="description text-center">Edit your profile</p>
                            <form onSubmit={this.onSubmit}> {/* onSubmit used instead of normal action*/}
                                <FormInputGroup
                                    name="FullName"
                                    placeholder="Full Name"
                                    value={this.state.FullName}
                                    type="text"
                                    onChange={this.onChange}
                                    error={errors.FullName}
                                />
                                <FormInputGroup
                                    name="Email"
                                    placeholder="Email Address"
                                    value={this.state.Email}
                                    type="Email"
                                    onChange={this.onChange}
                                    error={errors.Email}
                                />
                                <FormInputGroup
                                    name="ContactNumber"
                                    placeholder="Enter Contact Number"
                                    value={this.state.ContactNumber}
                                    type="Password"
                                    onChange={this.onChange}
                                    error={errors.ContactNumber}
                                />
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
                                <input type="submit" className="btn btn-info btn-block mt-5"/>
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
    authenticatedUser: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

// Used to pull auth state and errors into this component.... DEFINED IN reducers/index.js {combineReducers}
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors
    });

export default connect(stateToProps, {getClientData, editClientData })(withRouter(EditClient));
