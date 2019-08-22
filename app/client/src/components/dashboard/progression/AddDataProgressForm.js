import React, {Component} from 'react' // React is need for rendering JSX HTML elements in render -> return.
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {
    ptNewClientProgress,
    setErrors,
    clearErrors,
    clearSuccess,
} from "../../../actions/ptProfileActions";
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
            progressDate: '',
            formId : "#"+ props.exerciseName.replace(/\s+/g, '-'),
            visible: false,
            errors: {},
            message: {},
            progressFormHeight: props.progressFormHeight
        };
    } // constructor

    static getDerivedStateFromProps(props, state) {
        //Set default date to today's date, makes sure date is always entered.
        if (props.visible !== state.visible) {
            let defaultDate = new Date(Date.now()).toISOString().substring(0, 10);
            return {
                progressDate: defaultDate,
                visible: props.visible,
                message: {}
            }
        }
        if (state.errors !== state.message){
            return {
                message: state.errors
            }
        }
        if (!isEmpty(props.errors) && isEmpty(state.message)){
            return {
                message: props.errors
            }
        }
        if (!isEmpty(props.success) && isEmpty(state.message)) {
            return {
                message: props.success
            }
        }
        if(isEmpty(props.errors)){
            AddDataProgressForm.onFocus();
        }
        return null
    }

    componentDidMount(){
        let formHeight;
        let el = document.querySelector(this.state.formId + "-form");
        formHeight = el.offsetHeight;
        formHeight += parseInt(window.getComputedStyle(el).getPropertyValue('margin-top'), 20);
        formHeight += parseInt(window.getComputedStyle(el).getPropertyValue('margin-bottom'), 20);
        this.setState({progressFormHeight: formHeight + 30});

        this.props.clearErrors();
        this.props.clearSuccess();

    }

    // Checking if previous props modal visibility and this states visibility is not equal (stops reacts maximum loop message when
    // setting state) so that fields and errors can be cleared when exiting modal (using onClickAway instead of close button).
    componentDidUpdate(prevProps){
        if(this.state.progressFormHeight > prevProps.progressFormHeight ){
            let newHeight = this.state.progressFormHeight;
            this.props.modalSize(newHeight.toString())
        }
    }

    static onFocus(){
        document.getElementsByName('maxWeight')[0].focus();
    }

    onChange = e => {
        let {name, value} = e.target;

        // Make sure measurement entered is a number and value does not exceed 3 characters if not then don't
        // update state and exit function
        if(name === 'maxWeight' && isNaN(value)){
            this.setState({
                errors: {
                    maxWeight: "Measurement must be a numerical value between 0-999"
                }
            });
            return null;
        }
        else if(name === 'maxWeight' && value.length > 3) {
            this.setState({
                errors: {
                    maxWeight: "Measurement value must be between 0-999"
                }
            });
            return null;
        }

        let defaultDate = new Date(Date.now()).toISOString().substring(0, 10);

        // Check that valid date is given and is not in future.
        if(name === 'progressDate'){
            if(value === "" || (value > defaultDate)){
                this.setState({
                    errors: {
                        progressDate: "A valid date must be entered."
                    }});
                return null
            }
        }

        this.setState({
            [name]: value,
            message: {},
            errors: {}
        });

        if(!isEmpty(this.props.errors)){
            this.props.clearErrors();
        }
        if(!isEmpty(this.props.success)){
            this.props.clearSuccess();
        }
    };

    onClose = () => {
        // The use of onClick with this.props.onClickAway() allows this to call the parents onClickAway (note the use of props)
        this.props.onClickAway();
        // Clear errors once the modal has been exited
        this.props.clearErrors();
        this.setState({
            message: {},
            errors: {}
        });
        // Reset/ Clear input fields once modal has been exited
    };

    ptGetClientProgression(){
        this.props.ptGetClientProgression(this.state.clientId, this.props.history);
    }

    onSubmit = e => {
        e.preventDefault();
        this.setState({
            message: {},
        });
        this.props.clearSuccess();

        let {exerciseName, history} = this.props;
        let {maxWeight, progressDate, clientId} = this.state;

        if (isEmpty(maxWeight)){
            this.setState({
                errors: {
                    maxWeight: " Please enter a maxWeight value."
                }
            });
            return null;
        }
        else if(isEmpty(progressDate)){
            this.setState({
                errors: {
                    progressDate: " Please enter a valid date."
                }
            });
            return null;
        }
        else{
            const clientProgressData = {
                exerciseName: exerciseName,
                metrics: {
                    maxWeight: maxWeight,
                    Date: new Date(progressDate)
                }
            };
            this.props.ptNewClientProgress(clientId, clientProgressData, history);
        }
    }; // onSubmit

    render() {
        let {errors, message, maxWeight, progressDate} = this.state;
        let {exerciseName} = this.props;
        return (
            <div className="AddBodyDataProgressForm">
                <div>
                    <button className="closeButton"  onClick={this.onClose}><i className="fas fa-window-close 2x"></i></button>
                </div>
                <div id={exerciseName.replace(/\s+/g, '-') + "-form"} className="modal-margin">
                    <form autoComplete="off" onSubmit={this.onSubmit}>
                        <label className="control-label form-control-lg new-progression">
                            Exercise: {exerciseName}
                        </label>
                        <label className="control-label form-control-lg new-progression">
                            One Rep Max Weight (Kg):
                        </label>
                        <FormInputGroup
                            name="maxWeight"
                            PlaceHolder="Max Weight"
                            value={maxWeight}
                            type="text"
                            onChange={this.onChange}
                            error={errors.maxWeight}
                        />
                        <label className="control-label form-control-lg new-progression">
                            Date:
                        </label>
                        <FormInputGroup
                            myClassName="progress-date"
                            name="progressDate"
                            PlaceHolder="Date"
                            value={progressDate}
                            type="Date"
                            onChange={this.onChange}
                            error={errors.Date || errors.progressDate}
                        />
                        <DisplayMessage message={message}/>
                        {/*<div className="valid-feedback">{this.state.success.msg}</div>*/}
                        <input type="submit" value="Submit" className="btn btn-info btn-block mt-4 mb-5"/>
                    </form>
                </div>
            </div>
        );

    }; // render
}

AddDataProgressForm.propTypes = {
    modalSize: PropTypes.func.isRequired,
    progressFormHeight: PropTypes.string.isRequired,
    ptNewClientProgress: PropTypes.func.isRequired,
    setErrors: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    success: PropTypes.object.isRequired
};

const stateToProps = (state) => ({
    errors: state.errors,
    success: state.success
});


export default connect(stateToProps, {ptNewClientProgress, setErrors, clearErrors, clearSuccess})(withRouter(AddDataProgressForm));
