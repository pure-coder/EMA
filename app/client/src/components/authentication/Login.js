import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import classnames from 'classnames';  // Used for dynamically setting class name for errors on page
import { connect } from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import { loginUser} from "../../actions/authenticationActions"; // Used to import create action for registering user
import { withRouter } from 'react-router-dom'; // Allows proper routing and linking using browsers match, location, and history properties


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Email: '',
            Password: '',
            errors: {}
        }

        // This sets the state value to it's respective state (via binding)
        this.onChange = this.onChange.bind(this);

        // This binds the onSubmit function to this.OnSubmit
        this.onSubmit = this.onSubmit.bind(this);
    }

    // Life cycle method for react which will run when this component receives new properties
    componentWillReceiveProps(nextProps) {

        // Check if isAuthenticated is true then redirect to the dashboard
        if(nextProps.authenticatedUser.isAuthenticated){
            this.props.history.push('/dashboard');
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
        }

        // Calls the action/reducer loginUser with the user data (defined in actions/authenticatedActions.js)
        this.props.loginUser(user);
    }


    render() {

        const {errors} = this.state; // This allows errors to be pulled out of this.state with pulling them out directly

        return (
            <div className="login">
                <div className="container  login-custom">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="text-center display-5">Log In</h1>
                            <p className="description text-center">Sign into Fitness App account</p>
                            <form onSubmit={this.onSubmit}>  {/* onSubmit used instead of normal action*/}
                                <div className="form-group">
                                    <input type="email"
                                        // Using classnames package to display errors to user if they occur
                                        // 1st parameter are default classes that should always be used, the 2nd
                                        // parameter adds 'is-invalid' if errors.FullName exists
                                           className={classnames('form-control form-control-lg', {'is-invalid': errors.Email})}
                                           placeholder="Email Address"
                                           name="Email"
                                           value={this.state.Email}
                                           onChange={this.onChange}
                                            />
                                    {/* This adds the feedback to the user (which was defined in*/}
                                    {/*  validation/registration.js on the API server*/}
                                    {errors.Email && (<div className="invalid-feedback">
                                        {errors.Email}
                                    </div>)}
                                </div>
                                <div className="form-group">
                                    <input type="password"// Using classnames package to display errors to user if they occur
                                        // 1st parameter are default classes that should always be used, the 2nd
                                        // parameter adds 'is-invalid' if errors.FullName exists
                                           className={classnames('form-control form-control-lg', {'is-invalid': errors.Password})}
                                           placeholder="Password"
                                           name="Password"
                                           value={this.state.Password}
                                           onChange={this.onChange}
                                    />
                                    {/* This adds the feedback to the user (which was defined in*/}
                                    {/*  validation/registration.js on the API server*/}
                                    {errors.Password && (<div className="invalid-feedback">
                                        {errors.Password}
                                    </div>)}
                                </div>
                                <input type="submit" className="btn btn-info btn-block mt-5"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    authenticatedUser: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

// Used to pull auth state into this component
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors
});

// connect must be exported with a passed parameter (not direct parameter) of Login this is wrapped with withRouter
// allowing the functions of the package to be used with the component eg, proper routing, and direct parameters of
// stateToProps for the 1st parameter and the action which is registerUser as the 2nd parameter
export default connect(stateToProps, { loginUser })(withRouter(Login));
