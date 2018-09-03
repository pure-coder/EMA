import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import { connect } from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import { registerClient} from "../../actions/authenticationActions"; // Used to import create action for registering user
import { withRouter } from 'react-router-dom';
import FormInputGroup from "../common/FormInputGroup"; // Allows proper routing and linking using browsers match, location, and history properties

class Register extends Component {
    // This allows the component states to be updated and re-rendered
    constructor(props) {
        super(props);
        this.state = {
            FullName: '',
            Email: '',
            contactNumber: '',
            errors: {}
        }

        // This sets the state value to it's respective state (via binding)
        this.onChange = this.onChange.bind(this);

        // This binds the onSubmit function to this.OnSubmit
        this.onSubmit = this.onSubmit.bind(this);
    }

    // Life cycle method for react which will run when this component receives new properties
    componentDidMount() {
        // Check if isAuthenticated is true then redirect to the dashboard
        if (this.props.authenticatedUser.isAuthenticated) {
            this.props.history.push('/dashboard');
        }
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

        const newUser = {
            FullName: this.state.FullName,
            Email: this.state.Email,
            ContactNumber: this.state.contactNumber
        }

        // Calls the action/reducer loginUser with the user data as well
        // as using the history function of withRouter for directing user to another link/route. (calls registerClient
        // from actions/authenticationActions.js)
        this.props.registerClient(newUser , this.props.history);
    }

    render() {
        const {errors} = this.state; // This allows errors to be pulled out of this.state with pulling them out directly

        return (
            <div className="register">
                <div className="container  register-custom">
                    <div className="row">
                        <div className="m-auto col-md-8">
                            <h1 className=" text-center display-5">Personal Trainer <br/> Sign Up</h1>
                            <p className="description text-center">Enter basic Client details below</p>
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
                                    value={this.state.contactNumber}
                                    type="Password"
                                    onChange={this.onChange}
                                    error={errors.ContactNumber}
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
Register.propTypes = {
    registerClient: PropTypes.func.isRequired,
    authenticatedUser: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

// Used to pull auth state and errors into this component
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors
});

// connect must be exported with a passed parameter (not direct parameter) of Register this is wrapped with withRouter
// allowing the functions of the package to be used with the component eg, proper routing, and direct parameters of
// stateToProps for the 1st parameter and the action which is registerClient as the 2nd parameter
export default connect(stateToProps, { registerClient })(withRouter(Register));
