import React, {Component} from 'react';
import {addGraph} from "../../../utilities/drawProgressGraph";
import {deleteExercise, getClientProgression} from "../../../actions/profileActions";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router-dom";
import Modal from "react-awesome-modal";
import EditDataProgressForm from './EditDataProgressForm';
import DeleteProgressConfirm from "./DeleteProgressConfirm";
import AddDataProgressForm from "./AddDataProgressForm";
import isEmpty from "../../../utilities/is_empty";
import ErrorComponent from "../../error/ErrorComponent";

class CreateGraph extends Component {
    constructor(props){
        super(props);
        this.state = {
            userId : props.match.params.uid || props.authenticatedUser.user.id,
            clientId: props.authenticatedUser.clientId || props.match.params.cid,
            metrics : this.props.graphData.metrics,
            visible: false,
            modalHeight: "400",
            modalWidth: "500",
            form: undefined
        };

        this.openModal = this.openModal.bind(this);
        this.onClickAway = this.onClickAway.bind(this);
        this.modalSize = this.modalSize.bind(this);
    }

    openModal(e) {
        if(e.target.value === "Delete Exercise"){
            this.setState({form: "Delete"})
        }
        if(e.target.value === "Add Data"){
            this.setState({form: "Add"});
        }
        if(e.target.value === "Edit Data"){
            this.setState({form: "Edit"});
        }
        this.setState({
            visible : true
        });
    }

    onClickAway() {
        this.setState({
            visible: false,
            form: undefined
        });

        // Reset modal size
        this.modalSize("400");

        // Get new data
        this.getClientProgression();
    }

    getClientProgression(){
        this.props.getClientProgression(this.state.userId, this.state.clientId, this.props.history);
    }

    modalSize(height){
        this.setState({modalHeight: height});
    }

    sortedProgressionMap(graphData){
        return graphData.sort((obj1, obj2) => {
            return new Date(obj1.Date) - new Date(obj2.Date);
        });
    }; // sortedMap

    drawGraph(isUpdate){
        let exerciseToId = this.props.graphData.exerciseName.replace(/\s+/g, '-');
        const metrics = this.sortedProgressionMap(this.props.graphData.metrics);
        // Graph is drawn here. Had to make sure className in return was rendered 1st before calling this function
        // as it needs it to append on too.

        addGraph(metrics, '.' + exerciseToId, this.props.graphData.exerciseName, isUpdate);
    }

    componentDidMount(){
        this.drawGraph(false);
    }

    componentDidUpdate(prevProps){
        // Only update the exercise that has added or deleted metric data
        if(prevProps.graphData.metrics !== this.props.graphData.metrics) {
            this.drawGraph(true)
        }
    }

    render(){
        if(isEmpty(this.props.authenticatedUser.user)){
            return <ErrorComponent/>
        }
        let displayForm;

        let display;
        display = (
                (this.props.authenticatedUser.user.pt === true && this.props.graphData.metrics.length >= 2 ?
                    (
                        <div className="btn-toolbar">
                            <div className="col-4">
                            <input type="button" className="btn btn-info progress-buttons"
                           value="Edit Data" name={this.props.graphData.exerciseName} onClick={this.openModal} />
                            </div>
                            <div className="col-4">
                            <input type="button" className="btn btn-success progress-buttons"
                                   value="Add Data" name={this.props.graphData.exerciseName} onClick={this.openModal} />
                            </div>
                            <div className="col-4">
                            <input type="button" className="btn btn-danger progress-buttons"
                           value="Delete Exercise" name={this.props.graphData.exerciseName} onClick={this.openModal} />
                            </div>
                        </div>
                    ) : null)


        );

        // Provide component depending on what button was pressed
        if(this.state.form === 'Delete') {
            displayForm = (
                <DeleteProgressConfirm exerciseName={this.props.graphData.exerciseName} onClickAway={this.onClickAway}
                                       visible={this.state.visible}
                                        modalSize={this.modalSize}
                                        progressFormHeight={this.state.modalHeight}/>
            )
        }
        if(this.state.form === 'Add') {
            displayForm = (
                <AddDataProgressForm exerciseName={this.props.graphData.exerciseName} onClickAway={this.onClickAway}
                                       visible={this.state.visible}
                                       modalSize={this.modalSize}
                                       progressFormHeight={this.state.modalHeight}/>
            )
        }
        if(this.state.form === 'Edit') {
            displayForm = (
                <EditDataProgressForm exerciseName={this.props.graphData.exerciseName}
                                      exerciseId={this.props.graphData._id}
                                      metrics={this.state.metrics}
                                      onClickAway={this.onClickAway}
                                      visible={this.state.visible}
                                      modalSize={this.modalSize}
                                      progressFormHeight={this.state.modalHeight}/>
            )
        }

        return (
            <div>
                <div className={this.props.graphData.exerciseName.replace(/\s+/g, '-') + " graph"}></div>
                {display}

                <Modal visible={this.state.visible} width={this.state.modalWidth} height={this.state.modalHeight} effect="fadeInUp"
                       onClickAway={this.onClickAway}>
                    {displayForm}
                </Modal>
            </div>
        )
    }
}

CreateGraph.propTypes = {
    graphData: PropTypes.object.isRequired,
    deleteExercise: PropTypes.func.isRequired,
    getClientProgression: PropTypes.func.isRequired
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors
});

export default connect(stateToProps, {deleteExercise, getClientProgression})(withRouter(CreateGraph));
