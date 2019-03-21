import React, {Component} from 'react' // React is need for rendering JSX HTML elements in render -> return.
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {newClientProgress, setErrors, clearErrors, setSuccess} from "../../actions/authenticationActions";
import autocomplete from '../../utilities/autoComplete';
import FormInputGroup from "../common/FormInputGroup";


class NewClientProgressForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.authenticatedUser.user.id,
            clientId: props.match.params.Cid,
            exerciseName: '',
            maxWeight: '',
            Date: '',
            visible: false,
            errors: {},
            success: props.success,
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
                "Bench press",
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

        this.onChange = this.onChange.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        this.onClose= this.onClose.bind(this);

        this.onClick = this.onClick.bind(this);
        this.onBlur = this.onBlur.bind(this);
    } // constructor

    static getDerivedStateFromProps(props, state) {
        if (props.visible !== state.visible) {
            return {visible: props.visible}
        }
        if (props.errors !== state.errors) {
            return {
                success: "",
                errors: props.errors
            }
        }
        if (props.success !== state.success) {
            return {success: props.success}
        }
        return null
    }

    componentDidMount(){
        document.body.scrollTo(0,0);
    }


    // Checking if previous props modal visibility and this states visibility is not equal (stops reacts maximum loop message when
    // setting state) so that fields and errors can be cleared when exiting modal (using onClickAway instead of close button).
    componentDidUpdate(prevProps){
        if(prevProps.visible !== this.state.visible){
            this.setState({
                exerciseName: '',
                maxWeight: '',
                Date: ''
            });
            this.props.clearErrors();
        }
    }

    onClick(e){
        // If input field is for exerciseName, complete the auto list
        if(e.target.name === 'exerciseName') {
            this.onLoadList(e);
        }
        // Set success message to empty if re-entering data after a successful previous submission.
        if(this.state.success.msg !== '') {
            this.props.setSuccess('');
        }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    // When input field is click (Really on clicked)
    onLoadList(e){
        // Sort the array, this is then used as argument for autocomplete
        const exerciseList = this.state.exercises.sort();
        // e.target and document.getElementById(e.target.id) return the same output, so using former.
        autocomplete(e.target, exerciseList, this.state);
    }

    onClose(){
        // The use of onClick with this.props.onClickAway() allows this to call the parents onClickAway (note the use of props)
        this.props.onClickAway();
        // Clear errors once the modal has been exited
        this.props.clearErrors();
        // Reset/ Clear input fields once modal has been exited
        this.setState({
            exerciseName: '',
            maxWeight: '',
            Date: ''
        });
    }

    // This is needed to set the exercise name to state on blur, as can't set state in the autocomplete external function
    onBlur(){
        let selectedExercise = document.getElementById("exerciseName").value;
        this.setState({exerciseName: selectedExercise });
    }

    onSubmit(e) {
        e.preventDefault();

        const exerciseName = this.state.exerciseName;

        if (!this.state.exercises.includes(exerciseName)){
            this.props.setErrors({exerciseName: "Please select an exercise from those provided!"});
        }
        else{
            const clientProgressData = {
                exerciseName: this.state.exerciseName,
                metrics: {
                    maxWeight: this.state.maxWeight,
                    Date: new Date(this.state.Date)
                }
            };
            this.props.newClientProgress(this.state.userId, this.state.clientId, clientProgressData);
        }
    } // onSubmit

    render() {
        let {errors} = this.state;
        return (
            <div className="newClientProgress">
                <div>
                    <button className="closeButton"  onClick={this.onClose}><i className="fas fa-window-close 2x"></i></button>
                </div>
                <form autoComplete="off" onSubmit={this.onSubmit}>
                    <label className="control-label form-control-lg edit-profile-label">
                        Exercise:
                    </label>
                    <div className="autocomplete">
                        <FormInputGroup
                            name="exerciseName"
                            PlaceHolder="Exercise Name"
                            value={this.state.exerciseName}
                            id="exerciseName"
                            type="text"
                            onChange={this.onChange}
                            error={errors.exerciseName}
                            onClick={this.onClick}
                            onBlur={this.onBlur}
                        />
                    </div>
                    <label className="control-label form-control-lg edit-profile-label">
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
                    <label className="control-label form-control-lg edit-profile-label">
                        Date:
                    </label>
                    <FormInputGroup
                        name="Date"
                        PlaceHolder="Date"
                        value={this.state.Date}
                        type="Date"
                        onChange={this.onChange}
                        onClick={this.onClick}
                        error={errors.Date}
                    />
                    <div className="valid-feedback">{this.state.success.msg}</div>
                    <input type="submit" className="btn btn-info btn-block mt-2 mb-5"/>
                </form>
            </div>
        );

    }; // render
}

NewClientProgressForm.propTypes = {
    newClientProgress: PropTypes.func.isRequired,
    setErrors: PropTypes.func.isRequired,
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


export default connect(stateToProps, {newClientProgress, setErrors, clearErrors, setSuccess})(withRouter(NewClientProgressForm));
