import React, {Component} from 'react' // React is need for rendering JSX HTML elements in render -> return.
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {setErrors, clearErrors, clearSuccess, deleteExercise, editClientExercise} from "../../../actions/authenticationActions";
import FormInputGroup from "../../common/FormInputGroup";
import DisplayMessage from "../../common/DisplayMessage";
import isEmpty from "../../../validation/is_empty";


class EditDataProgressForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.authenticatedUser.user.id,
            clientId: props.match.params.cid,
            visible: false,
            metrics: props.metrics,
            toDelete: [],
            edited: false,
            errors: {},
            message: {
                type: null
            },
            progressFormHeight: props.progressFormHeight
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onClose= this.onClose.bind(this);
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
    }

    onChange(e) {
        const metrics = this.state.metrics;
        const toDelete = this.state.toDelete;
        let id = e.target.id;
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

        // Only add data to metrics if name is date or maxWeight (keep delete data separate)
        if (name === 'Date' || name === 'maxWeight'){
            metrics[id][name] = value;
        }

        this.setState({
            metrics,
            toDelete,
            edited : true
        });

        this.props.clearErrors();
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
    }

    onSubmit(e) {
        e.preventDefault();
        this.setState({
            message: {type: null},
        });
        this.props.clearSuccess();

        // Check if any data has been changed, don't want to waste server load and bandwidth on empty requests
        let dataChanged = this.state.edited;
        let message;

        if(!dataChanged){
            message = {
                type: "ERROR",
                msg: "No data has been modified or deleted!"
            };
            this.setState({message});
            return null;
        }
        else{
            this.props.clearErrors();
            let deleteMetrics = this.state.toDelete;
            let originalMetrics = this.state.metrics;
            let newMetrics = [];

            // Check if all items have been selected for deletion, if so make new empty array and send that to edit function
            if(originalMetrics.length === deleteMetrics.length){
                originalMetrics = [];
            }
            else{
                for(let i = 0, len = originalMetrics.length; i < len; i++){
                    if(!deleteMetrics.includes(originalMetrics[i]._id)){
                        newMetrics.push(originalMetrics[i]);
                    }
                }
            }

            // Delete whole exercise from client progression
            if(isEmpty(originalMetrics)){
                this.props.deleteExercise(this.state.userId, this.state.clientId, this.props.exerciseName, this.props.history);
                this.onClose();
            }
            // Send new array to overwrite current data for exercise in db for client
            else{
                this.props.editClientExercise(this.state.userId, this.state.clientId, this.props.exerciseId, newMetrics, this.props.history);
                this.onClose();
            }

        }
    } // onSubmit

    render() {
        let {errors, message} = this.state;
        
        return (
            <div className="editClientProgress">
                <div>
                    <button className="closeButton"  onClick={this.onClose}><i className="fas fa-window-close 2x"></i></button>
                </div>
                <div className="progress-form-div">
                    <form autoComplete="off" onSubmit={this.onSubmit}>
                        <label className="control-label form-control-lg new-progression">
                            Exercise: {this.props.exerciseName}
                        </label>
                        <label className="control-label form-control-lg new-progression">
                            Data to be modified or deleted:
                        </label>
                        <table className="table client-table edit-progression-table">
                            <thead>
                            <tr>
                                <th id="client-table-name">Date</th>
                                <th align="center">Max Weight</th>
                                <th align="center">Delete</th>
                            </tr>
                            {
                                this.state.metrics.map((metric, index) => {
                                    let metricDate = new Date(metric.Date).toISOString().substring(0, 10);
                                    return ( <tr key={metric._id}>
                                        <td>
                                            {/*<input type="date" name="Date" value={metricDate}/>*/}
                                            < FormInputGroup
                                                name="Date"
                                                id={index}
                                                value={metricDate}
                                                type="date"
                                                onChange={this.onChange}
                                                error={errors.Date}
                                            />
                                        </td>
                                        <td>
                                            {/*<input type="text" name="maxWeight" value={metric.maxWeight}/>*/}
                                            < FormInputGroup
                                                name="maxWeight"
                                                id={index}
                                                value={metric.maxWeight.toString()}
                                                type="text"
                                                onChange={this.onChange}
                                                error={errors.maxWeight}
                                            />
                                        </td>
                                        <td>
                                            {/*<input type="checkbox" name="delete"/>*/}
                                            < FormInputGroup
                                                name="Delete"
                                                id={index}
                                                type="checkbox"
                                                value={metric._id}
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
                        <input type="submit" className="btn btn-info btn-block mt-4 mb-5"/>
                    </form>
                </div>
            </div>
        );

    }; // render
}

EditDataProgressForm.propTypes = {
    modalSize: PropTypes.func.isRequired,
    progressFormHeight: PropTypes.string.isRequired,
    setErrors: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    deleteExercise: PropTypes.func.isRequired,
    editClientExercise: PropTypes.func.isRequired,
    authenticatedUser: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    success: PropTypes.object.isRequired
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors,
    success: state.success
});


export default connect(stateToProps, {setErrors, clearErrors, clearSuccess, deleteExercise, editClientExercise})(withRouter(EditDataProgressForm));
