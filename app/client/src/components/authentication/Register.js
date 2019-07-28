import React, { Component } from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import { connect } from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {registerUser} from "../../actions/authenticationActions"; // Used to import create action for registering user
import {clearErrors, clearSuccess} from "../../actions/profileActions";
import {withRouter} from 'react-router-dom';
import FormInputGroup from "../common/FormInputGroup";
import FormSelectComp from "../common/FormSelectComp"; // Allows proper routing and linking using browsers match, location, and history properties


class Register extends Component {
    // This allows the component states to be updated and re-rendered
    constructor(props) {
        super(props);
        this.state = {
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
            success: undefined,
            errors: {}
        };

        // This sets the state value to it's respective state (via binding)
        this.onChange = this.onChange.bind(this);

        // This binds the onSubmit function to this.OnSubmit
        this.onSubmit = this.onSubmit.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props !== state) {
            return {
                errors: props.errors,
                success: props.success,
            }
        }
        return null
    }

    componentDidMount() {
        this.props.clearErrors();
        this.props.clearSuccess();
        document.body.scrollTo(0,0);
    }

    // This captures what the user types and sets the specific input to the respective state variable
    onChange(event) {
        // event.target.name is used instead of a specific named state (ie "event.target.FullName") as there is more then
        // one, making it easier to capture all of them with this onChange function.
        this.setState({[event.target.name]: event.target.value})
    }

    onSubmit(event) {
        event.preventDefault();
        // Clear previous success messages
        this.props.clearSuccess();

        // Clear errors messages
        this.props.clearErrors();
        this.setState({errors: {}});

        const newUser = {
            FullName: this.state.FullName,
            Email: this.state.Email,
            DateOfBirth: this.state.DateOfBirth,
            Sex: this.state.Sex,
            Password: this.state.Password,
            Password2: this.state.Password2
        };

        // If no errors occur then register user
        this.props.registerUser(newUser, this.props.history);
    }

    render() {
        const {errors} = this.state; // This allows errors to be pulled out of this.state with pulling them out directly

        return (
            <div className="register">
                <div className="container  register-custom">
                    <div className="row">
                        <div className="m-auto col-md-8">
                            <h1 className=" text-center display-5">Personal Trainer <br/> Sign Up</h1>
                            <p className="description text-center">Create your Personal Trainer account</p>
                            <form onSubmit={this.onSubmit}> {/* onSubmit used instead of normal action*/}
                                <FormInputGroup
                                    myClassName="register-pt"
                                    name="FullName"
                                    placeholder="Full Name"
                                    value={this.state.FullName}
                                    type="text"
                                    onChange={this.onChange}
                                    error={errors.FullName}
                                />
                                <FormInputGroup
                                    myClassName="register-pt"
                                    name="Email"
                                    placeholder="Email Address"
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
                                            value={this.state.DateOfBirth}
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
                                    myClassName="register-pt"
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
                                <div className="text-success">{this.state.success !== undefined ? this.state.success.msg: null}</div>
                                <input type="submit" className="btn btn-info btn-block mt-4 mb-5"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// Documents what props are needed for this component and will log a warning in the console in dev mode if not complied to
Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    authenticatedUser: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

// Used to pull auth state and errors into this component.... DEFINED IN reducers/index.js {combineReducers}
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors,
    success: state.success
    });


/* connect has stateToProps for the 1st parameter which is used to retrieve the current state of the redux store, the parameter is used to for the action, which is used to change the current state of the redux store. Remember that the redux-store cannot be directly accessed, this is done via actions.


 Connect must be exported with a passed parameter (not direct parameter) of Register this is wrapped with withRouter function that is part of the react-router-dom package. This allows
 the functions of the package to be used with the component (in this case Register) eg, proper routing, and direct parameters */
export default connect(stateToProps, { registerUser, clearErrors, clearSuccess })(withRouter(Register));
