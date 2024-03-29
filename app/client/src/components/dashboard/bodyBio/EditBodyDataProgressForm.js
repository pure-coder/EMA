import React, {Component} from 'react' // React is need for rendering JSX HTML elements in render -> return.
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {setErrors, clearErrors, clearSuccess, ptDeleteBodyPart, ptEditClientBodyBio} from "../../../redux/actions/ptProfileActions";
import FormInputGroup from "../../common/Forms/FormInputGroup";
import DisplayMessage from "../../common/Message/DisplayMessage";
import isEmpty from "../../../validation/is_empty";


class EditBodyDataProgressForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.ids.userId,
            clientId: props.ids.clientId,
            visible: false,
            bodyMetrics: props.bodyMetrics,
            original: [],
            toDelete: [],
            edited: false,
            errors: {},
            message: {},
            progressFormHeight: props.progressFormHeight,
        };
    } // constructor

    static getDerivedStateFromProps(props, state) {
        if (props.visible !== state.visible) {
            return {visible: props.visible}
        }
        if (!isEmpty(state.errors)){
            return {
                message: state.errors
            }
        }
        if (!isEmpty(props.errors) && isEmpty(state.message)){
            return {
                message: props.errors
            }
        }
        if (!isEmpty(props.success)) {
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

        this.setState({
            progressFormHeight: formHeight,
        });

        // Change format of Date in bodyMetrics so that it can be presented correctly in HTML 5 date format.
        // Was previously getting errors when converting in map below as onChange would not except a single zero, etc
        this.state.bodyMetrics.forEach(bodyMetrics => {
            bodyMetrics.Date = new Date(bodyMetrics.Date).toISOString().substring(0, 10);
        });

        this.props.clearErrors();
        this.props.clearSuccess();
    }

    // Checking if previous props modal visibility and this states visibility is not equal (stops reacts maximum loop message when
    // setting state) so that fields and errors can be cleared when exiting modal (using onClickAway instead of close button).
    componentDidUpdate(prevProps){
        if(prevProps.visible !== this.state.visible){
            this.props.clearErrors();
            this.props.clearSuccess();
        }

        if(this.state.progressFormHeight > prevProps.progressFormHeight ){
            let newHeight = this.state.progressFormHeight;
            this.props.modalSize(newHeight.toString())
        }

        if(prevProps.bodyMetrics !== this.props.bodyMetrics){
            // Change format of Date in bodyMetrics so that it can be presented correctly in HTML 5 date format.
            // Was previously getting errors when converting in map below as onChange would not except a single zero, etc
            this.props.bodyMetrics.forEach(bodyMetrics => {
                bodyMetrics.Date = new Date(bodyMetrics.Date).toISOString().substring(0, 10);
            });

            this.setState({bodyMetrics: this.props.bodyMetrics});
        }
    }

    onChange = e => {
        this.setState({
            message: {},
            errors: {}
        });
        const {bodyMetrics, toDelete} = this.state;
        let {id, name, value} = e.target;

        // Make sure measurement entered is a number and value does not exceed 3 characters if not then don't
        // update state and exit function
        if(name === 'measurement' && isNaN(value)){
            this.setState({
                errors: {
                    id: id,
                    measurement: "Numbers only"
                }
            });
            return null;
        }
        else if(name === 'measurement' && value.length > 3){
            this.setState({
                errors: {
                    id: id,
                    measurement: "Max 0-999"
                }
            });
            return null;
        }

        let defaultDate = new Date(Date.now()).toISOString().substring(0, 10);

        // Check that valid date is given and is not in future.
        if(name === 'Date'){
            if(value === "" || (value > defaultDate)){
                this.setState({
                    errors: {
                        id: id,
                        Date: "A valid date must be entered."
                    }
                });
                return null
            }
        }

        // For delete checkbox, check to see if data key exists in delete if un/checked.
        if(name === 'Delete'){
            // toDelete doesn't include data key then push key into array
            if(!toDelete.includes(value)){
                toDelete.push(value)
            }
            // otherwise remove value
            else{
                toDelete.splice(toDelete.indexOf(value), 1);
            }
        }

        // Only add data to bodyMetrics if name is date or measurement (keep delete data separate)
        if (name === 'Date' || name === 'measurement'){
            bodyMetrics[id][name] = value;
        }

        this.setState({
            bodyMetrics,
            toDelete,
            edited : true
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
    };

    onSubmit = e => {
        e.preventDefault();
        this.setState({
            message: {},
            errors: {}
        });
        this.props.clearSuccess();

        // Check if any data has been changed, don't want to waste server load and bandwidth on empty requests
        let dataChanged = this.state.edited;

        if(!dataChanged){
            this.setState({
                errors: {
                    type: "ERROR",
                    msg: "No data has been modified or deleted!"
                }});
        }
        else{
            this.props.clearErrors();
            let {toDelete, bodyMetrics, clientId} = this.state;
            let {bodyPart, bodyPartId, history} = this.props;
            let newMetrics = [];

            // Check if all items have been selected for deletion, if so delete data
            if(bodyMetrics.length === toDelete.length){
                this.props.ptDeleteBodyPart(clientId, bodyPart, history);
                // Close edit modal there is no data to display.
                this.onClose();
            }
            // Send new array to overwrite current data for bodyPart in db for client
            else{
                for(let i = 0, len = bodyMetrics.length; i < len; i++){
                    if(!toDelete.includes(bodyMetrics[i]._id)){
                        newMetrics.push(bodyMetrics[i]);
                    }
                }
                this.props.ptEditClientBodyBio(clientId, bodyPartId, newMetrics, history);
                this.setState({
                    edited: false
                })
            }
        }
    }; // onSubmit

    render() {
        let {errors, message, bodyMetrics} = this.state;
        let {bodyPart} = this.props;
        
        return (
            <div className="editClientProgressBodyPart">
                <div>
                    <button className="closeButton"  onClick={this.onClose}><i className="fas fa-window-close 2x"></i></button>
                </div>
                <div className="progress-form-div">
                    <form autoComplete="off" onSubmit={this.onSubmit}>
                        <label className="control-label form-control-lg new-progression">
                            Exercise: {bodyPart}
                        </label>
                        <label className="control-label form-control-lg new-progression">
                            Data to be modified or deleted:
                        </label>
                        <table className="table client-table edit-bodyPart-progression-table">
                            <thead>
                            <tr>
                                <th id="client-table-name">Date</th>
                                <th align="center">Measurement</th>
                                <th align="center">Delete</th>
                            </tr>
                            {
                                bodyMetrics.map(({Date, measurement, _id}, index) => {
                                    return ( <tr key={_id}>
                                        <td>
                                            < FormInputGroup
                                                myClassName="edit-bodyPart"
                                                name="Date"
                                                id={index}
                                                value={Date.toString()}
                                                type="date"
                                                onChange={this.onChange}
                                                error={errors.id === index.toString() && errors.Date}
                                            />
                                        </td>
                                        <td>
                                            < FormInputGroup
                                                myClassName="edit-bodyPart"
                                                name="measurement"
                                                id={index}
                                                value={measurement.toString()}
                                                type="text"
                                                onChange={this.onChange}
                                                error={errors.id === index.toString() && errors.measurement}
                                            />
                                        </td>
                                        <td>
                                            < FormInputGroup
                                                myClassName="edit-bodyPart"
                                                name="Delete"
                                                id={index}
                                                type="checkbox"
                                                value={_id}
                                                onChange={this.onChange}
                                                error={errors.deleted}
                                            />
                                        </td>
                                    </tr> )
                                })
                            }
                            </thead>
                        </table>
                        <DisplayMessage message={message}/>
                        <input type="submit" value="Update" className="btn btn-info btn-block mt-4 mb-5"/>
                    </form>
                </div>
            </div>
        );

    }; // render
}

EditBodyDataProgressForm.propTypes = {
    modalSize: PropTypes.func.isRequired,
    progressFormHeight: PropTypes.string.isRequired,
    setErrors: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    ptDeleteBodyPart: PropTypes.func.isRequired,
    ptEditClientBodyBio: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    success: PropTypes.object.isRequired
};

const stateToProps = (state) => ({
    errors: state.errors,
    success: state.success
});


export default connect(stateToProps, {setErrors, clearErrors, clearSuccess, ptDeleteBodyPart, ptEditClientBodyBio})(withRouter(EditBodyDataProgressForm));
