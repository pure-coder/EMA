import React, {Component} from 'react' // React is need for rendering JSX HTML elements in render -> return.
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {newClientProgress, setErrors, clearErrors, clearSuccess, ptGetClientProgression} from "../../../actions/ptProfileActions";
import FormInputGroup from "../../common/FormInputGroup";
import DisplayMessage from "../../common/DisplayMessage";
import isEmpty from "../../../validation/is_empty";


class AddDataProgressForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.ids.userId,
            clientId: props.ids.clientId,
            maxWeight: '',
            Date: '',
            visible: false,
            errors: {},
            success: {},
            message: {
                type: null
            },
            progressFormHeight: props.progressFormHeight
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onClose= this.onClose.bind(this);
        this.onClick = this.onClick.bind(this);
    } // constructor

    static getDerivedStateFromProps(props, state) {
        if(props.progressFormHeight < state.progressFormHeight){
            return {
                progressFormHeight: state.progressFormHeight
            }
        }
        if (props.visible !== state.visible) {
            return {visible: props.visible}
        }
        if (isEmpty(props.errors) !== isEmpty(state.errors)){
            return {
                errors: props.errors
            }
        }
        if (isEmpty(props.success) !== isEmpty(state.success)) {
            return {
                message: props.success
            }
        }
        return null
    }

    componentDidMount(){
        let formHeight;
        let el = document.querySelector(".progress-form-div");
        formHeight = el.offsetHeight;
        formHeight += parseInt(window.getComputedStyle(el).getPropertyValue('margin-top'), 10);
        formHeight += parseInt(window.getComputedStyle(el).getPropertyValue('margin-bottom'), 10);
        this.setState({progressFormHeight: formHeight});

        this.props.clearErrors();
        this.props.clearSuccess();

    }

    // Checking if previous props modal visibility and this states visibility is not equal (stops reacts maximum loop message when
    // setting state) so that fields and errors can be cleared when exiting modal (using onClickAway instead of close button).
    componentDidUpdate(prevProps){
        if(prevProps.visible !== this.state.visible){
            this.setState({
                maxWeight: '',
                Date: ''
            });
            this.props.clearErrors();
            this.props.clearSuccess();
        }

        if(this.state.progressFormHeight > prevProps.progressFormHeight ){
            let newHeight = this.state.progressFormHeight;
            this.props.modalSize(newHeight.toString())
        }
    }

    onClick(){
        // Set success message to empty if re-entering data after a successful previous submission.
        if(!isEmpty(this.state.success)) {
            this.props.clearSuccess();
        }
    }

    static onFocus(){
        document.getElementsByName('maxWeight')[0].focus();
    }

    onChange(e) {
        let name = e.target.name;
        let value = e.target.value;

        // For maxWeight Check to see if value entered is a number, if not then don't update state and exit function.
        if(name === 'maxWeight' && isNaN(value)){
            return null;
        }

        // Make sure maxWeight value does not exceed 3 characters
        if(name === 'maxWeight' && (value.length > 3)){
            let message = {
                type: "ERROR",
                msg: "Max Weight value must be between 0-999!"
            };
            this.setState({message});
            return null;
        }
        else{
            this.setState({message: {type: null}}); // reset to null
        }

        this.setState({[name]: value});

        if(!isEmpty(this.props.errors)){
            this.props.clearErrors();
        }
        this.setState({message: {type: null}}); // reset to null
        if(!isEmpty(this.props.success)){
            this.props.clearSuccess();
        }
    }

    onClose(){
        // The use of onClick with this.props.onClickAway() allows this to call the parents onClickAway (note the use of props)
        this.props.onClickAway();
        // Clear errors once the modal has been exited
        this.props.clearErrors();
        this.setState({message: {type: null}});
        // Reset/ Clear input fields once modal has been exited
        this.clearFields();
    }

    ptGetClientProgression(){
        this.props.ptGetClientProgression(this.state.clientId, this.props.history);
    }

    clearFields(){
        this.setState({maxWeight: ''});
        this.setState({Date: ''});
    }

    onSubmit(e) {
        e.preventDefault();
        this.setState({
            message: {type: null},
        });
        this.props.clearSuccess();

        // Check if any data has been changed, don't want to waste server load and bandwidth on empty requests
        let dataChanged = false;
        let message;

        const clientProgressData = {
            exerciseName: this.props.exerciseName,
            metrics: {
                maxWeight: this.state.maxWeight,
                Date: new Date(this.state.Date)
            }
        };

        // Check to see if data has been entered or modified
        if(!isEmpty(clientProgressData.metrics.maxWeight) || !isEmpty(clientProgressData.metrics.Date)){
                dataChanged = true;
        }

        if(!dataChanged){
            message = {
                type: "ERROR",
                msg: "No data has been entered or modified!"
            };
            this.setState({message});
            return null;
        }
        else{
            this.props.clearErrors();
            this.props.newClientProgress(this.state.clientId, clientProgressData, this.props.history);
            // Clear data from fields
            this.clearFields();
            // Show data added to database and updated on page in real time
            this.ptGetClientProgression();
            // Once data is submitted focus on adding new data (via focusing on 1st input element, in this case max weight!)
            AddDataProgressForm.onFocus();
        }
    } // onSubmit

    render() {
        let {errors, message} = this.state;
        return (
            <div className="newClientProgress">
                <div>
                    <button className="closeButton"  onClick={this.onClose}><i className="fas fa-window-close 2x"></i></button>
                </div>
                <div className="progress-form-div">
                    <form autoComplete="off" onSubmit={this.onSubmit}>
                        <label className="control-label form-control-lg new-progression">
                            Exercise: {this.props.exerciseName}
                        </label>
                        <label className="control-label form-control-lg new-progression">
                            One Rep Max Weight (Kg):
                        </label>
                        <FormInputGroup
                            name="maxWeight"
                            PlaceHolder="Max Weight"
                            value={this.state.maxWeight}
                            type="text"
                            onChange={this.onChange}
                            onClick={this.onClick}
                            error={errors.maxWeight}
                        />
                        <label className="control-label form-control-lg new-progression">
                            Date:
                        </label>
                        <FormInputGroup
                            myClassName="progress-date"
                            name="Date"
                            PlaceHolder="Date"
                            value={this.state.Date}
                            type="Date"
                            onChange={this.onChange}
                            onClick={this.onClick}
                            error={errors.Date}
                        />
                        <DisplayMessage message={message}/>
                        {/*<div className="valid-feedback">{this.state.success.msg}</div>*/}
                        <input type="submit" className="btn btn-info btn-block mt-4 mb-5"/>
                    </form>
                </div>
            </div>
        );

    }; // render
}

AddDataProgressForm.propTypes = {
    modalSize: PropTypes.func.isRequired,
    progressFormHeight: PropTypes.string.isRequired,
    newClientProgress: PropTypes.func.isRequired,
    setErrors: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    ptGetClientProgression: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    success: PropTypes.object.isRequired
};

const stateToProps = (state) => ({
    errors: state.errors,
    success: state.success
});


export default connect(stateToProps, {newClientProgress, setErrors, clearErrors, clearSuccess, ptGetClientProgression})(withRouter(AddDataProgressForm));
