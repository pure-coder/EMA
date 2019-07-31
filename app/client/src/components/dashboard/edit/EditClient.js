import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {editClientData, passwordsMatchError, setErrors, clearErrors, setSuccess, clearSuccess, getCurrentClient} from "../../../actions/ptProfileActions"; // Used to import create action for getting client data and editing client data
import {getClientData} from "../../../actions/clientProfileActions";
import {withRouter} from 'react-router-dom';
import FormInputGroup from "../../common/FormInputGroup";
import Loading from "../../../elements/Loading";
import isEmpty from "../../../utilities/is_empty";
import ErrorComponent from "../../error/ErrorComponent"; // Allows proper routing and linking using browsers match, location, and history properties
import DisplayMessage from '../../common/DisplayMessage';
import FormSelectComp from "../../common/FormSelectComp";
import defaultUserImage from "../../../img/user-regular.svg";

class EditClient extends Component {
    // This allows the component states to be updated and re-rendered
    constructor(props) {
        super(props);
        this.state = {
            client_data: undefined,
            clientId: !props.authenticatedUser.user.pt ? props.authenticatedUser.user.id : props.match.params.cid,
            FullName: '',
            Email: '',
            ContactNumber: '',
            Sex: '',
            DateOfBirth: '',
            Password: '',
            Password2: '',
            values : [
                "Male",
                "Female"
            ],
            errors: {},
            location: this.props.location,
            success: {},
            loaded: false,
            updated: false,
            message: {
                type: null
            } // Set to null so null is returned from DisplayMessage by default
        };

        // This sets the state value to it's respective state (via binding)
        this.onChange = this.onChange.bind(this);

        // This binds the onSubmit function to this.OnSubmit
        this.onSubmit = this.onSubmit.bind(this);
    }

    // Populate state data with data from the database for the client
    static getDerivedStateFromProps(props, state) {
        if(props.authenticatedUser.user.pt){
            if (props.ptProfile.current_client !== state.client_data) {
                return {
                    client_data: props.ptProfile.current_client,
                    success: props.success,
                    errors: props.errors,
                    loaded: true
                }
            }
        }
        else if (props.clientProfile.client_data !== state.client_data) {
            return {
                client_data: props.clientProfile.client_data,
                success: props.success,
                errors: props.errors,
                loaded: true
            }
        }
        if(isEmpty(props.success) !== isEmpty(state.success)){
            return {
                message: props.success
            }
        }
        if(isEmpty(props.errors) !== isEmpty(state.errors)){
            return {
                errors: props.errors
            }
        }
        return null
    }

    componentDidMount() {
        if(this.props.authenticatedUser.user.pt){
            this.props.getCurrentClient(this.state.clientId, this.props.history)
        }
        else {
            this.props.getClientData(this.state.clientId, this.props.history);
        }
        this.props.clearErrors();
        this.props.clearSuccess();
        document.body.scrollTo(0,0);
    }

    componentDidUpdate(){
        let data = null;
        if(this.props.authenticatedUser.user.pt) {
            if (this.props.ptProfile.current_client !== null) {
                data = this.props.ptProfile.current_client;
            }
        }
        else{
            if (this.props.clientProfile.client_data !== null) {
                data = this.props.clientProfile.client_data;
            }
        }
        if(data !== null && !this.state.updated){
            this.setState({
                FullName : data.FullName,
                Email : data.Email,
                ContactNumber : data.ContactNumber,
                Sex : data.Sex,
                DateOfBirth: data.DateOfBirth.substring(0, 10),
                updated : true
            })
        }
    }

    componentWillUnmount(){
        this.props.clearErrors();
        this.props.clearSuccess();
    }

    // This captures what the user types and sets the specific input to the respective state variable
    onChange(event) {
        let eventName = event.target.name;
        let eventValue = event.target.value;
        // Initialise previous data to this data
        this.setState({[eventName]: eventValue});

        this.props.clearErrors();
        this.setState({message: {type: null}}); // reset to null
        if(!isEmpty(this.props.success)){
            this.props.clearSuccess();
        }
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.clearSuccess();

        // Clear errors
        this.props.clearErrors();
        this.setState({errors: {}});

        // Check if any data has been changed, don't want to waste server load and bandwidth on empty requests
        let dataChanged = false;
        // Set errors using spread operator on nested state (only calls setState once)
        let errors = {...this.state.errors};

        const editData = {
            FullName: this.state.FullName,
            Email: this.state.Email,
            ContactNumber: this.state.ContactNumber,
            // ProfilePicUrl: this.state.ProfilePicUrl,
            DateOfBirth: this.state.DateOfBirth,
            Sex: this.state.Sex,
            Password: this.state.Password,
            Password2: this.state.Password2
        };

        // Use client data supplied to form for managing form field data after data has been submitted (keeps view the same whilst resetting
        // state.FullName etc.
        let client_data = this.state.client_data;

        // Check if any of the fields have been modified.
        for(let element in editData) {
            if(element === "DateOfBirth"){
                client_data[element] = client_data[element].substring(0,10);
            }
            // Check if data has changed
            if(!isEmpty(editData[element]) && client_data[element] !== editData[element]){
                // Update client_data with new data.
                if (client_data.hasOwnProperty(element)){
                    client_data[element] = editData[element];
                }
                dataChanged = true;
            }
        }

        let message;

        if (!dataChanged){
            message = {
                type: "ERROR",
                msg: "No data has been modified!"
            };
            this.setState({message});
            this.props.setErrors(errors);
            return null;
        }
        else if (!(this.state.Password === this.state.Password2)) {
            errors.Password = "Passwords must match";
            errors.Password2 = "Passwords must match";
            this.props.passwordsMatchError(errors);
            return null;
        }
        else {
            this.props.editClientData(this.state.clientId, editData, this.props.history);
            // Clear password match errors
            this.props.clearErrors();
            this.setState({
                FullName : this.state.FullName,
                Email : this.state.Email,
                ContactNumber : this.state.ContactNumber,
                Sex: this.state.Sex,
                DateOfBirth: this.state.DateOfBirth,
                Password: '',
                Password2: '',
                client_data: client_data
            });
        }
    }

    render() {


        const client_data = this.state.client_data;

        if(client_data === null){
            return <Loading myClassName="loading_container"/>
        }
        if(isEmpty(this.props.authenticatedUser.user)){
            return <ErrorComponent/>
        }
        else {
            let {errors, message} = this.state;

            return (
                <div className="edit_client">
                    <div className="container  edit_client-custom">
                        <div className="row">
                            <div className="m-auto col-md-8">
                                <h1 className=" text-center display-5">Edit Client Profile</h1>
                                <div className="edit_image">
                                    {(<img
                                        className = "rounded-circle"
                                        alt={client_data.ProfilePicUrl === "NA" ? "Default user image." : "User profile picture."}
                                        src = {client_data.ProfilePicUrl === "NA" ? defaultUserImage : defaultUserImage}
                                    />)}
                                </div>
                                <form autoComplete="off" onSubmit={this.onSubmit}>
                                    {/*// Deals with Chromes password auto complete*/}
                                    <input type="password" style={{height: 0, width: 0, opacity: 0, padding: 0, border: "none"}}></input>
                                    <FormInputGroup
                                        myClassName="edit-client"
                                        name="FullName"
                                        placeholder={this.state.client_data.FullName}
                                        value={this.state.FullName}
                                        type="text"
                                        onChange={this.onChange}
                                        error={errors.FullName}
                                    />
                                    <FormInputGroup
                                        myClassName="edit-client"
                                        name="Email"
                                        placeholder="Email"
                                        value={this.state.Email}
                                        type="Email"
                                        onChange={this.onChange}
                                        error={errors.Email}
                                    />
                                    <FormInputGroup
                                        myClassName="edit-client"
                                        name="ContactNumber"
                                        placeholder="ContactNumber"
                                        value={this.state.ContactNumber}
                                        type="text"
                                        onChange={this.onChange}
                                        error={errors.ContactNumber}
                                    />
                                    <div className="form-group edit-profile-date-div">
                                        <div className="edit-date-div">
                                            <label className="control-label form-control-lg edit-profile-label">Date of
                                                Birth:
                                            </label>
                                            < FormInputGroup
                                                myClassName="edit-exercise"
                                                name="DateOfBirth"
                                                value={this.state.DateOfBirth.toString()}
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
                                        myClassName="edit-client"
                                        name="Password"
                                        placeholder="Enter Password"
                                        value={this.state.Password}
                                        type="password"
                                        onChange={this.onChange}
                                        error={errors.Password}
                                    />
                                    <FormInputGroup
                                        name="Password2"
                                        placeholder="Confirm Password"
                                        value={this.state.Password2}
                                        type="password"
                                        onChange={this.onChange}
                                        error={errors.Password2}
                                    />
                                    <DisplayMessage message={message}/>
                                    <input type="submit" value="Update" className="btn btn-info btn-block mt-1"/>
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
EditClient.propTypes = {
    getClientData: PropTypes.func.isRequired,
    getCurrentClient: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    setErrors: PropTypes.func.isRequired,
    setSuccess: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired,
    passwordsMatchError: PropTypes.func.isRequired,
    authenticatedUser: PropTypes.object.isRequired,
    ptProfile: PropTypes.object.isRequired,
    clientProfile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

// Used to pull auth state and errors into this component.... DEFINED IN reducers/index.js {combineReducers}
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    ptProfile: state.ptProfile,
    clientProfile: state.clientProfile,
    errors: state.errors,
    success: state.success
});

export default connect(stateToProps, {getClientData, getCurrentClient ,editClientData, passwordsMatchError, setErrors, setSuccess, clearErrors, clearSuccess})(withRouter(EditClient));
