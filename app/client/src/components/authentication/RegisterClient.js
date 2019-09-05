import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import { connect } from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import { registerClient, clearSuccess, clearErrors} from "../../actions/ptProfileActions"; // Used to import create action for registering user
import { withRouter } from 'react-router-dom';
import FormInputGroup from "../common/Forms/FormInputGroup";
import Loading from "../common/Loading/Loading";
import isEmpty from "../../utilities/is_empty";
import FormSelectComp from "../common/Forms/FormSelectComp";
import DisplayMessage from "../common/Message/DisplayMessage";
import checkExp from "../../utilities/checkExp"; // Allows proper routing and linking using browsers match, location, and history properties

class RegisterClient extends Component {
    // This allows the component states to be updated and re-rendered
    constructor(props) {
        super(props);
        this.state = {
            FullName: '',
            Email: '',
            DateOfBirth: '',
            Sex: '',
            ContactNumber: '',
            errors: {},
            message: {},
            Values : [
                "Male",
                "Female"
            ],
            success: undefined,
        };
    }

    // Populate state data with data from the database for the pt
    static getDerivedStateFromProps(props, state) {
        if(!isEmpty(state.errors)){
            return {
                errors: state.errors
            }
        }
        if (props !== state) {
            return {
                errors: props.errors,
                message: props.success,
            }
        }
        return null
    }

    componentDidMount() {
        const {isAuthenticated} = this.props.authenticatedUser;
        if(!isAuthenticated)
            this.props.history.push('/login');
        checkExp();
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

        if(name === 'ContactNumber' && isNaN(value)){
            this.setState({
                errors: {
                    ContactNumber: "Must contain numbers only."
                }
            });
            return null;
        }

        if(name === 'ContactNumber' && isNaN(value)){
            this.setState({
                errors: {
                    ContactNumber: "Must contain numbers only."
                }
            });
            return null;
        }
        else if(name === 'ContactNumber' && value.length > 11) {
            this.setState({
                errors: {
                    ContactNumber: "Contact Number must not contain more than 11 numbers."
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

        const {FullName, Email, DateOfBirth, Sex, ContactNumber} = this.state;

        const newUser = {
            FullName: FullName,
            Email: Email,
            DateOfBirth: DateOfBirth,
            Sex: Sex,
            ContactNumber: ContactNumber
        };

        this.props.registerClient(newUser , this.props, this.props.history);
    };

    render() {
        if(!this.props.authenticatedUser.isAuthenticated){
            return <Loading myClassName="loading_container"/>
        }
        const {errors, message, FullName, Email, DateOfBirth, ContactNumber, Values} = this.state; // This allows errors to be pulled out of this.state with pulling them out directly

        return (
            <div className="register page-margin-top">
                <div className="container  register-custom">
                    <div className="row pb-4">
                        <div className="m-auto col-md-8">
                            <p className="description text-center">Enter New Client Details Below</p>
                            <form onSubmit={this.onSubmit}> {/* onSubmit used instead of normal action*/}
                                <FormInputGroup
                                    myClassName="register-client"
                                    name="FullName"
                                    placeholder="Full Name"
                                    value={FullName}
                                    type="text"
                                    onChange={this.onChange}
                                    error={errors.FullName}
                                />
                                <FormInputGroup
                                    myClassName="register-client"
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
                                    myClassName="edit-contact-div"
                                    name="ContactNumber"
                                    placeholder="Enter Contact Number"
                                    value={ContactNumber}
                                    type="text"
                                    onChange={this.onChange}
                                    error={errors.ContactNumber}
                                />
                                <DisplayMessage message={message}/>
                                <input type="submit" value="Register Client" className="btn btn-info btn-block mt-1"/>
                                <button type="button" className="btn btn-success btn-block mt-3 mb-5"
                                        onClick={this.props.history.goBack}>Back
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// Documents what props are needed for this component and will log a warning in the console in dev mode if not complied to
RegisterClient.propTypes = {
    registerClient: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired,
    authenticatedUser: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

// Used to pull auth state and errors into this component.... DEFINED IN reducers/index.js {combineReducers}
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors,
    success: state.success
});

// connect must be exported with a passed parameter (not direct parameter) of Register this is wrapped with withRouter
// allowing the functions of the package to be used with the component eg, proper routing, and direct parameters of
// stateToProps for the 1st parameter and the action which is registerClient as the 2nd parameter
export default connect(stateToProps, {
    registerClient,
    clearErrors,
    clearSuccess
})(withRouter(RegisterClient));
