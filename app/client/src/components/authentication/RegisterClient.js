import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import { connect } from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import { registerClient, clearSuccess, clearErrors} from "../../actions/authenticationActions"; // Used to import create action for registering user
import { withRouter } from 'react-router-dom';
import FormInputGroup from "../common/FormInputGroup";
import Loading from "../../elements/Loading";
import isEmpty from "../../utilities/is_empty";
import ErrorComponent from "../error/ErrorComponent"; // Allows proper routing and linking using browsers match, location, and history properties

class RegisterClient extends Component {
    // This allows the component states to be updated and re-rendered
    constructor(props) {
        super(props);
        this.state = {
            FullName: '',
            Email: '',
            ContactNumber: '',
            errors: {},
            success: undefined,
            loaded: false
        };

        // This sets the state value to it's respective state (via binding)
        this.onChange = this.onChange.bind(this);

        // This binds the onSubmit function to this.OnSubmit
        this.onSubmit = this.onSubmit.bind(this);
    }

    // Populate state data with data from the database for the pt
    static getDerivedStateFromProps(props, state) {
        if (props !== state) {
            return {
                errors: props.errors,
                success: props.success,
                loaded: true
            }
        }
        return null
    }

    componentDidMount() {
        this.props.clearErrors();
        this.props.clearSuccess();
        document.body.scrollTo(0,0);
    }

    componentDidUpdate(){
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
            ContactNumber: this.state.ContactNumber
        };

        this.props.registerClient(newUser , this.props, this.props.history);
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
            const {errors} = this.state; // This allows errors to be pulled out of this.state with pulling them out directly

            return (
                <div className="register">
                    <div className="container  register-custom">
                        <div className="row">
                            <div className="m-auto col-md-8">
                                <h1 className=" text-center display-5">Client Sign Up</h1>
                                <p className="description text-center">Enter Client details below</p>
                                <form onSubmit={this.onSubmit}> {/* onSubmit used instead of normal action*/}
                                    <FormInputGroup
                                        myClassName="register-client"
                                        name="FullName"
                                        placeholder="Full Name"
                                        value={this.state.FullName}
                                        type="text"
                                        onChange={this.onChange}
                                        error={errors.FullName}
                                    />
                                    <FormInputGroup
                                        myClassName="register-client"
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
                                            {errors.Sex ? (<select name="Sex" onChange={this.onChange} id="Sex" className='form-control
                                            form-control-lg invalid-feedback-other'>
                                                    <option value="">Please select</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>) :
                                                (<select name="Sex" onChange={this.onChange} id="Sex" className='form-control
                                            form-control-lg'>
                                                    <option value="">Please select</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>)
                                            }
                                        </div>
                                        {errors.Sex ? (<div className="invalid-feedback">{errors.Sex}</div>) : null}
                                    </div>
                                    <FormInputGroup
                                        name="ContactNumber"
                                        placeholder="Enter Contact Number"
                                        value={this.state.ContactNumber}
                                        type="text"
                                        onChange={this.onChange}
                                        error={errors.ContactNumber}
                                    />
                                    <div className="text-success">{this.state.success !== undefined ? this.state.success.msg: null}</div>
                                    <input type="submit" className="btn btn-info btn-block mt-4"/>
                                    <button type="button" className="btn btn-danger btn-block mt-3 mb-3"
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
export default connect(stateToProps, { registerClient, clearErrors, clearSuccess})(withRouter(RegisterClient));
