import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {getPtData,  editPtData, passwordsMatchError} from "../../actions/authenticationActions"; // Used to import create action for getting pt data and editing pt data
import {withRouter} from 'react-router-dom';
import FormInputGroup from "../common/FormInputGroup";
import Loading from "../../elements/Loading";
import isEmpty from "../../utilities/is_empty";
import ErrorComponent from "../error/ErrorComponent"; // Allows proper routing and linking using browsers match, location, and history properties

class EditPersonalTrainer extends Component {
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
            ptId: props.authenticatedUser.user.id,
            errors: props.errors,
            location: this.props.location,
            loaded: false
        };

        // This sets the state value to it's respective state (via binding)
        this.onChange = this.onChange.bind(this);

        // This binds the onSubmit function to this.OnSubmit
        this.onSubmit = this.onSubmit.bind(this);
    }

    // Populate state data with data from the database for the pt
    static getDerivedStateFromProps(props, state) {
        console.log(props)
        if (props.authenticatedUser.pt_data !== state.pt_data) {
            console.log(props);
            return {
                pt_data: props.authenticatedUser.pt_data,
                errors: props.errors,
                loaded: true
            }
        }
        if (props.errors !== state.errors) {
            return {errors: props.errors}
        }
        return null
    }

    componentDidMount() {
        document.body.scrollTo(0,0);
        this.authCheck();
        this.props.getPtData(this.state.ptId, this.props.history);
    }

    componentDidUpdate(){
        this.authCheck();
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
            //ProfilePicUrl: this.state.ProfilePicUrl,
            Sex: this.state.Sex,
            Password: this.state.Password,
            Password2: this.state.Password2
        };

        if (this.state.Password === this.state.Password2) {
            this.props.editPtData(this.props.match.params.uid, editData, this.props.history);
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

    authCheck(){
        if(this.state.errors.error_code === 401){
            console.log("this");
            this.props.history.push('/re-login');
        }
    }

    render() {
        // if loaded is false then return loading screen
        if (!this.state.loaded) {
            return <Loading/>;
        }
        if(isEmpty(this.props.authenticatedUser.user)){
            return <ErrorComponent/>
        }
        else{
            const {errors} = this.state; // This allows errors to be pulled out of this.state without pulling them out directly
            return (
                <div className="edit_client">
                    <div className="container  edit_client-custom">
                        <div className="row">
                            <div className="m-auto col-md-8">
                                <h1 className=" text-center display-5">Edit Profile</h1>
                                <form onSubmit={this.onSubmit}> {/* onSubmit used instead of normal action*/}
                                    <FormInputGroup
                                        name="FullName"
                                        placeholder={this.state.pt_data.FullName}
                                        value={this.state.FullName}
                                        type="text"
                                        onChange={this.onChange}
                                        error={errors.FullName}
                                    />
                                    <FormInputGroup
                                        name="Email"
                                        placeholder={this.state.pt_data.Email}
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
                                            <input className='form-control form-control-lg date-input' name="DateOfBirth"
                                                   onChange={this.onChange} type="Date"/>
                                        </div>
                                        <div className="edit-gender-div">
                                            <label
                                                className="control-label form-control-lg edit-profile-label gender">
                                                Gender:
                                            </label>
                                            <select name="Sex" onChange={this.onChange} id="Sex" className='form-control
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
                                    <input type="submit" value="Update" className="btn btn-info btn-block mt-4"/>
                                    <button type="button" className="btn btn-danger btn-block mt-3 mb-3" onClick={this.props.history.goBack}>Back</button>
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
EditPersonalTrainer.propTypes = {
    getPtData: PropTypes.func.isRequired,
    passwordsMatchError: PropTypes.func.isRequired,
    authenticatedUser: PropTypes.object.isRequired,
    //errors: PropTypes.object.isRequired
};

// Used to pull auth state and errors into this component.... DEFINED IN reducers/index.js {combineReducers}
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors
});

export default connect(stateToProps, {getPtData, editPtData, passwordsMatchError})(withRouter(EditPersonalTrainer));
