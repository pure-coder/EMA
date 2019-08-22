import React, {Component} from 'react' // React is need for rendering JSX HTML elements in render -> return.
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {ptNewClientBodyBio, setErrors, clearErrors, clearSuccess} from "../../../actions/ptProfileActions";
import autocomplete from '../../../utilities/autoComplete';
import FormInputGroup from "../../common/FormInputGroup";
import DisplayMessage from "../../common/DisplayMessage";
import isEmpty from "../../../validation/is_empty";


class NewBodyProgressForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.authenticatedUser.user.id,
            clientId: props.match.params.cid,
            bodyPart: '',
            measurement: '',
            progressDate: '',
            visible: false,
            message: {},
            errors: {},
            progressFormHeight: props.progressFormHeight,
            measurementMetric : "(In)",
            bodyParts : [
                "Body Weight",
                "Neck",
                "Chest",
                "L-Bicep",
                "R-Bicep",
                "L-Forearm",
                "R-Forearm",
                "Waist",
                "L-Thigh",
                "R-Thigh",
                "L-calf",
                "R-calf"
            ],
        };
    } // constructor

    static getDerivedStateFromProps(props, state) {
        //Set default date to today's date, makes sure date is always entered.
        if (props.visible !== state.visible) {
            let defaultDate = new Date(Date.now()).toISOString().substring(0, 10);
            return {
                progressDate: defaultDate,
                visible: props.visible,
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
        if(isEmpty(props.errors)){
            NewBodyProgressForm.onFocus();
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
        if(!isEmpty(this.state.errors)){
            this.props.clearErrors();
        }
        if(!isEmpty(this.props.success)){
            this.props.clearSuccess();
        }
        this.setState({
            message: {},
            errors: {}
        });
        let {name, value} = e.target;

        if(name === 'bodyPart' && isEmpty(value)) {
            this.onLoadList(e);
            this.setState({
                message: {},
                errors: {}
            }); // reset to null
        }

        // Make sure measurement entered is a number and value does not exceed 3 characters if not then don't
        // update state and exit function
        if(name === 'measurement' && isNaN(value)){
            this.setState({
                errors: {
                    measurement: "Measurement must be a numerical value between 0-999"
                }
            });
            return null;
        }
        else if(name === 'measurement' && value.length > 3){
            this.setState({
                errors: {
                    measurement: "Measurement value must be between 0-999"
                }
            });
            return null;
        }

        let defaultDate = new Date(Date.now()).toISOString().substring(0, 10);

        // Check that valid date is given and is not in future.
        if(name === 'progressDate'){
            if(value === "" || (value > defaultDate)){
                this.setState({errors: {
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
    };

    // When input bodyPart field is clicked (onclicked)
    onLoadList = e => {
        const bodyPartList = this.state.bodyParts.sort();
        // e.target and document.getElementById(e.target.id) return the same output, so using former.
        autocomplete(e.target, bodyPartList);
    };

    onClose = () => {
        // The use of onClick with this.props.onClickAway() allows this to call the parents onClickAway (note the use of props)
        this.props.onClickAway();
        // Clear errors once the modal has been exited
        this.props.clearErrors();
        this.setState({
            bodyPart: '',
            measurement: '',
            progressDate: '',
            message: {},
            errors: {}
        });
    };

    // This is needed to set the bodyPart name to state on blur, as can't set state in the autocomplete external function
    onBlur = () => {
        let selectedBodyPart = document.getElementById("bodyPart").value;
        this.setState({bodyPart: selectedBodyPart });
    };

    static onFocus(){
        document.getElementsByName('measurement')[0].focus();
    }

    onSubmit = e => {
        e.preventDefault();
        this.setState({
            message: {},
            errors: {}
        });
        this.props.clearSuccess();

        let {bodyParts, bodyPart, measurement, progressDate, clientId} = this.state;
        let {history} = this.props;

        // Check if values have been entered
        if (!bodyParts.includes(bodyPart)) {
            this.setState({
                errors: {
                    bodyPart: " Please enter a valid body part."
                }
            });
            return null;
        }
        else if (isEmpty(measurement)){
            this.setState({
                errors: {
                    measurement: " Please enter a measurement value."
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
            const clientBodyProgressData = {
                bodyPart: bodyPart,
                bodyMetrics: {
                    measurement: measurement,
                    Date: new Date(progressDate)
                }
            };
            this.props.clearErrors();
            this.props.ptNewClientBodyBio(clientId, clientBodyProgressData, history);
        }
    }; // onSubmit

    render() {
        let {errors, message, bodyPart, measurement, progressDate, measurementMetric} = this.state;
        return (
            <div className="NewBodyProgressForm">
                <div>
                    <button className="closeButton"  onClick={this.onClose}><i className="fas fa-window-close 2x"></i></button>
                </div>
                <div className="progress-form-div">
                    <form autoComplete="off" onSubmit={this.onSubmit}>
                        <label className="control-label form-control-lg new-progression">
                            Body Part:
                        </label>
                        <div className="autocomplete">
                            <FormInputGroup
                                myClassName="bodyPartForm"
                                name="bodyPart"
                                PlaceHolder="Body Part"
                                value={bodyPart}
                                id="bodyPart"
                                type="text"
                                onChange={this.onChange}
                                error={errors.bodyPart}
                                onClick={this.onLoadList}
                                onBlur={this.onBlur}
                            />
                        </div>
                        <label className="control-label form-control-lg new-progression">
                            Measurement {bodyPart === "Body Weight" ? "(Kg)" : measurementMetric}:
                        </label>
                        <FormInputGroup
                            name="measurement"
                            PlaceHolder="Measurement (In)"
                            value={measurement}
                            type="text"
                            onChange={this.onChange}
                            error={errors.measurement}
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
                        <input type="submit" value="Submit" className="btn btn-info btn-block mt-4 mb-5"/>
                    </form>
                </div>
            </div>
        );

    }; // render
}

NewBodyProgressForm.propTypes = {
    modalSize: PropTypes.func.isRequired,
    progressFormHeight: PropTypes.string.isRequired,
    ptNewClientBodyBio: PropTypes.func.isRequired,
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


export default connect(stateToProps, {ptNewClientBodyBio, setErrors, clearErrors, clearSuccess})(withRouter(NewBodyProgressForm));
