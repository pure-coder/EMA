import React, {Component} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import { registerUser} from "../../actions/authenticationActions";

class Register extends Component {
    // This allows the component states to be updated and re-rendered
    constructor(props) {
        super(props);
        this.state = {
            FullName: '',
            Email: '',
            Password: '',
            Password2: '',
            errors: {}
        }

        // This sets the state value to it's respective state (via binding)
        this.onChange = this.onChange.bind(this);

        // This binds the onSubmit function to this.OnSubmit
        this.onSubmit = this.onSubmit.bind(this);
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
            Password: this.state.Password,
            Password2: this.state.Password2
        }
        console.log(newUser);

        // props stores the actions that will be used
        this.props.registerUser(newUser);

        // Post user data to the API specifically the user/register route
        axios
            .post('/api/register', newUser)
            .then(result => {
                console.log(result.data)
                    window.location='/login';
            }).catch(err => this.setState({errors: err.response.data})); // This sets the state of errors in the constructor
        // to the errors that have been catched so they can be directed to the user

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
                                <div className="form-group">
                                    <input type="text"
                                        // Using classnames package to display errors to user if they occur
                                        // 1st parameter are default classes that should always be used, the 2nd
                                        // parameter adds 'is-invalid' if errors.FullName exists
                                           className={classnames('form-control form-control-md', {'is-invalid': errors.FullName})}
                                           placeholder="Full Name"
                                           name="FullName"
                                           value={this.state.FullName}
                                           onChange={this.onChange}
                                    />
                                    {/* This adds the feedback to the user (which was defined in*/}
                                    {/*  validation/registration.js on the API server*/}
                                    {errors.FullName && (<div className="invalid-feedback">
                                        {errors.FullName}
                                    </div>)}
                                </div>
                                <div className="form-group">
                                    <input type="email"
                                        // Using classnames package to display errors to user if they occur
                                        // 1st parameter are default classes that should always be used, the 2nd
                                        // parameter adds 'is-invalid' if errors.FullName exists
                                           className={classnames('form-control form-control-md', {'is-invalid': errors.Email})}
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
                                    <input type="password"
                                        // Using classnames package to display errors to user if they occur
                                        // 1st parameter are default classes that should always be used, the 2nd
                                        // parameter adds 'is-invalid' if errors.FullName exists
                                           className={classnames('form-control form-control-md', {'is-invalid': errors.Password})}
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
                                <div className="form-group">
                                    <input type="password"
                                        // Using classnames package to display errors to user if they occur
                                        // 1st parameter are default classes that should always be used, the 2nd
                                        // parameter adds 'is-invalid' if errors.FullName exists
                                           className={classnames('form-control form-control-md', {'is-invalid': errors.Password2})}
                                           placeholder="Confirm Password"
                                           name="Password2"
                                           value={this.state.Password2}
                                           onChange={this.onChange}
                                    />
                                    {/* This adds the feedback to the user (which was defined in*/}
                                    {/*  validation/registration.js on the API server*/}
                                    {errors.Password2 && (<div className="invalid-feedback">
                                        {errors.Password2}
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

Register.prototypes = {
    registerUser: PropTypes.func.isRequired,
    authenticatedUser: PropTypes.object.isRequired
}

// Used to pull auth state into this component
const stateToProps = (state) => ({
       authenticatedUser: state.authenticatedUser
    });

// connect must be exported with a passed parameter (not direct parameter) of Register, and direct parameters of
// stateToProps for the 1st parameter and the action which is registerUser as the 2nd parameter
export default connect(stateToProps, { registerUser })(Register);
