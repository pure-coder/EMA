import React, {Component} from 'react' // React is need for rendering JSX HTML elements in render -> return.
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {ptNewClientProgress, setErrors, clearErrors, clearSuccess} from "../../../redux/actions/ptProfileActions";
import autocomplete from '../../../utilities/autoComplete';
import FormInputGroup from "../../common/Forms/FormInputGroup";
import DisplayMessage from "../../common/Message/DisplayMessage";
import isEmpty from "../../../validation/is_empty";


class NewClientProgressForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.authenticatedUser.user.id,
            clientId: props.match.params.cid,
            exerciseName: '',
            maxWeight: '',
            progressDate: '',
            visible: false,
            message: {},
            errors: {},
            progressFormHeight: props.progressFormHeight,
            exercises : [
                "Squat",
                "Leg press",
                "Lunge",
                "Deadlift",
                "Leg extension",
                "Leg curl",
                "Standing calf raise",
                "Seated calf raise",
                "Hip adductor",
                "Bench Press",
                "Chest fly",
                "Push-up",
                "Pull-down",
                "Pull-up",
                "Bent-over row",
                "Upright row",
                "Shoulder press",
                "Shoulder fly",
                "Lateral raise",
                "Shoulder shrug",
                "Pushdown",
                "Triceps extension",
                "Biceps curl",
                "Crunch",
                "Russian twist",
                "Leg raise",
                "Back extension"
            ],
        };
    } // constructor

    static getDerivedStateFromProps(props, state) {
        if (props.visible !== state.visible) {
            let defaultDate = new Date(Date.now()).toISOString().substring(0, 10);
            props.clearErrors();
            props.clearSuccess();
            return {
                progressDate: defaultDate,
                visible: props.visible,
                exerciseName: '',
                maxWeight: '',
                message: {},
                errors: {}
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
        return null
    }

    componentDidMount(){
        document.body.scrollTo(0,0);
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
        if(this.state.progressFormHeight < prevProps.progressFormHeight ){
            let newHeight = this.state.progressFormHeight;
            this.props.modalSize(newHeight.toString())
        }
    }

    onChange = e => {
        this.setState({
            message: {},
            errors: {}
        });
        let {name, value} = e.target;

        if(name === 'exerciseName' && isEmpty(value)) {
            this.onLoadList(e);
            this.setState({
                message: {},
                errors: {}
            }); // reset to null
        }

        // For maxWeight Check to see if value entered is a number, if not then don't update state and exit function.
        if(name === 'maxWeight' && isNaN(value)){
            this.setState({
                errors: {
                    maxWeight: "Max Weight must be a numerical value between 0-999"
                }
            });
            return null;
        }
        else if(name === 'maxWeight' && value.length > 3){
            this.setState({
                errors: {
                    maxWeight: "Max Weight value must be between 0-999"
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

        if(!isEmpty(this.state.errors)){
            this.props.clearErrors();
        }
        if(!isEmpty(this.props.success)){
            this.props.clearSuccess();
        }
    };

    // When input field is click (Really on clicked)
    onLoadList  = e => {
        const exerciseList = this.state.exercises.sort();
        autocomplete(e.target, exerciseList);

    };

    onClose = () =>{
        // The use of onClick with this.props.onClickAway() allows this to call the parents onClickAway (note the use of props)
        this.props.onClickAway();
        // Clear errors once the modal has been exited
        this.props.clearErrors();
        this.setState({
            exerciseName: '',
            maxWeight: '',
            progressDate: '',
            message: {},
            errors: {}
        });
    };

    // This is needed to set the exercise name to state on blur, as can't set state in the autocomplete external function
    onBlur = () =>{
        let selectedBodyPart = document.getElementById("exerciseName").value;
        this.setState({exerciseName: selectedBodyPart });
    };

    onSubmit = e => {
        e.preventDefault();
        this.setState({
            message: {},
            errors: {}
        });
        this.props.clearSuccess();

        let {exercises ,exerciseName, maxWeight, progressDate, clientId} = this.state;
        let {history} = this.props;

        // Check if values have been entered
        if (!exercises.includes(exerciseName)) {
            this.setState({
                errors: {
                    exerciseName: " Please enter a valid body part."
                }
            });
            return null;
        }
        else if (isEmpty(maxWeight)){
            this.setState({
                errors: {
                    maxWeight: " Please enter a measurement value."
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
            this.props.clearErrors();
            this.props.ptNewClientProgress(clientId, clientProgressData, history);
        }
    };// onSubmit

    render() {
        let {errors, message, exerciseName, maxWeight, progressDate} = this.state;
        return (
            <div className="NewClientProgressForm">
                <div>
                    <button className="closeButton"  onClick={this.onClose}><i className="fas fa-window-close 2x"></i></button>
                </div>
                <div className="progress-form-div">
                    <form autoComplete="off" onSubmit={this.onSubmit}>
                        <label className="control-label form-control-lg new-progression">
                            Exercise:
                        </label>
                        <div className="autocomplete">
                            <FormInputGroup
                                myClassName="exerciseNameForm"
                                name="exerciseName"
                                PlaceHolder="Exercise Name"
                                value={exerciseName}
                                id="exerciseName"
                                type="text"
                                onChange={this.onChange}
                                error={errors.exerciseName}
                                onClick={this.onLoadList}
                                onBlur={this.onBlur}
                            />
                        </div>
                        <label className="control-label form-control-lg new-progression">
                            One Rep Max Weight (Kg):
                        </label>
                        <FormInputGroup
                            name="maxWeight"
                            PlaceHolder="Max Weight"
                            id="maxWeight"
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

NewClientProgressForm.propTypes = {
    modalSize: PropTypes.func.isRequired,
    progressFormHeight: PropTypes.string.isRequired,
    ptNewClientProgress: PropTypes.func.isRequired,
    setErrors: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    authenticatedUser: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    success: PropTypes.object.isRequired
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors,
    success: state.success
});


export default connect(stateToProps, {ptNewClientProgress, setErrors, clearErrors, clearSuccess})(withRouter(NewClientProgressForm));
