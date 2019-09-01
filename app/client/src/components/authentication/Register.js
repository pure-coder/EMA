import React, { Component } from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import { connect } from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {registerUser} from "../../actions/authenticationActions"; // Used to import create action for registering user
import {clearErrors, clearSuccess} from "../../actions/ptProfileActions";
import {withRouter} from 'react-router-dom';
import FormInputGroup from "../common/Forms/FormInputGroup";
import FormSelectComp from "../common/Forms/FormSelectComp";
import isEmpty from "../../utilities/is_empty";
import DisplayMessage from "../common/Message/DisplayMessage"; // Allows proper routing and linking using browsers match, location, and history properties


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
            Values : [
                "Male",
                "Female"
            ],
            success: undefined,
            errors: {},
            message: {}
        };
    }

    static getDerivedStateFromProps(nextProps, state) {
        // Check if isAuthenticated is true then redirect to the dashboard
        if (nextProps.authenticatedUser.isAuthenticated) {
            nextProps.history.push('/users/' + nextProps.authenticatedUser.user.id + '/dashboard');
            return null
        }

        if(!isEmpty(state.errors)){
            return {
                errors: state.errors
            }
        }
        if (nextProps !== state) {
            return {
                errors: nextProps.errors,
                message: nextProps.success,
            }
        }
        return null
    }

    componentDidMount() {
        this.props.clearErrors();
        this.props.clearSuccess();
        document.body.scrollTo(0,0);
    }

    componentWillUnmount(){
        this.props.clearErrors();
        this.props.clearSuccess();
    }

    // This captures what the user types and sets the specific input to the respective state variable
    onChange = event => {
        const {name, value} = event.target;

        if(name === 'FullName' && value.length > 25){
            this.setState({
                errors: {
                    FullName: "Full Name must be less than 25 characters."
                }
            });
            return null;
        }

        this.setState({
            [name]: value,
            message: {},
            errors: {}
        })
    };

    onSubmit = event => {
        event.preventDefault();
        // Clear previous success messages
        this.props.clearSuccess();

        // Clear errors messages
        this.props.clearErrors();
        this.setState({
            errors: {},
            message: {}
        });

        const {FullName, DateOfBirth, Email, Sex, Password, Password2} = this.state;

        const newUser = {
            FullName: FullName,
            Email: Email,
            DateOfBirth: DateOfBirth,
            Sex: Sex,
            Password: Password,
            Password2: Password2
        };

        // If no errors occur then register user
        this.props.registerUser(newUser, this.props.history);
    };

    render() {
        const {errors, FullName, DateOfBirth, Email, Password, Password2, Values, message} = this.state; // This allows errors to be pulled out of this.state with pulling them out directly

        return (
            <div className="register page-margin-top">
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
                                    value={FullName}
                                    type="text"
                                    onChange={this.onChange}
                                    error={errors.FullName}
                                />
                                <FormInputGroup
                                    myClassName="register-pt"
                                    name="Email"
                                    placeholder="Email Address"
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
                                            value={DateOfBirth}
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
                                    myClassName="register-pt"
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
                                <input type="submit" value="Register" className="btn btn-info btn-block mt-4 mb-5"/>
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

export default connect(stateToProps, { registerUser, clearErrors, clearSuccess })(withRouter(Register));
