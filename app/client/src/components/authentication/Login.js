import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import { connect } from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import { loginUser} from "../../actions/authenticationActions"; // Used to import create action for registering user
import { withRouter, Redirect } from 'react-router-dom'; // Allows proper routing and linking using browsers match, location, and history properties
import FormInputGroup from '../common/FormInputGroup';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Email: '',
            Password: '',
            errors: {}
        };

        // This sets the state value to it's respective state (via binding)
        this.onChange = this.onChange.bind(this);

        // This binds the onSubmit function to this.OnSubmit
        this.onSubmit = this.onSubmit.bind(this);
    }

    // Life cycle method for react which will run when this component receives new properties
    componentWillReceiveProps(nextProps) {

        // Check if isAuthenticated is true then redirect to the dashboard
        if(nextProps.authenticatedUser.isAuthenticated){
            this.props.history.push('/users/' + nextProps.authenticatedUser.user.id + '/dashboard');
        }

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

    onSubmit(event){
        event.preventDefault();

        const user = {
            Email: this.state.Email,
            Password: this.state.Password,
        };

        // Calls the action/reducer loginUser with the user data (defined in actions/authenticatedActions.js)
        this.props.loginUser(user);
    }


    render() {

        const {errors} = this.state; // This allows errors to be pulled out of this.state with pulling them out directly

        if (this.props.authenticatedUser.isAuthenticated === true) {
            console.log("component mounted")
            return <Redirect to={{pathname: '/users/' + this.props.authenticatedUser.user.id + '/dashboard', state: {from: this.props.location}}}/>
        }

        return (
            <div className="login">
                <div className="container  login-custom">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="text-center display-5">Log In</h1>
                            <p className="description text-center">Sign into Fitness App account</p>
                            <form onSubmit={this.onSubmit}>  {/* onSubmit used instead of normal action*/}
                                <FormInputGroup
                                    name="Email"
                                    placeholder="Email Address"
                                    value={this.state.Email}
                                    type="Email"
                                    onChange={this.onChange}
                                    error={errors.Email}
                                />
                                <FormInputGroup
                                    name="Password"
                                    placeholder="Enter Password"
                                    value={this.state.password}
                                    type="Password"
                                    onChange={this.onChange}
                                    error={errors.Password}
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
Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    authenticatedUser: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

// Used to pull auth state and errors into this component.... DEFINED IN reducers/index.js {combineReducers}
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors
});

// connect must be exported with a passed parameter (not direct parameter) of Login this is wrapped with withRouter
// allowing the functions of the package to be used with the component eg, proper routing, and direct parameters of
// stateToProps for the 1st parameter and the action which is registerUser as the 2nd parameter
export default connect(stateToProps, { loginUser })(withRouter(Login));
