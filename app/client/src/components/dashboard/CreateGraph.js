import React, {Component} from 'react';
import {addGraph} from "../../utilities/drawProgressGraph";
import {deleteExercise} from "../../actions/authenticationActions";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router-dom";
import Modal from "react-awesome-modal";
import Loading from "../../elements/Loading";
import DeleteProgressConfirm from "./DeleteProgressConfirm";
import isEmpty from "../../utilities/is_empty";
import ErrorComponent from "../error/ErrorComponent";

class CreateGraph extends Component {
    constructor(props){
        super(props);
        this.state = {
            userId : props.match.params.uid || props.authenticatedUser.user.id,
            clientId: props.authenticatedUser.clientId || props.match.params.cid,
            visible: false,
            form: ''
        }

        this.openModal = this.openModal.bind(this);
        this.onClickAway = this.onClickAway.bind(this)
    }

    openModal(e) {
        if(e.target.value === "Delete Exercise"){
            this.setState({form: "Delete"});
        }
        this.setState({
            visible : true
        });
    }

    onClickAway() {
        this.setState({
            visible: false
        });
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

        // Only draw graph if metrics length for an exercise is >= 2
        if (metrics.length >= 2){
            addGraph(metrics, '.' + exerciseToId, this.props.graphData.exerciseName, isUpdate);
        }
    }

    componentDidMount(){
        this.drawGraph(false);
    }

    componentDidUpdate(prevProps){
        // Only update the exercise that has added or deleted metric data
        if(prevProps.graphData.metrics.length !== this.props.graphData.metrics.length) {
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
            <div className="progress-buttons">
                {this.props.authenticatedUser.user.pt === true && this.props.graphData.metrics.length >= 2 ?
                    (
                        <div>
                            <input id="edit-progress-button" type="button" className="btn btn-info btn-block mb-4"
                           value="Edit Exercise" onClick={this.openModal} />
                            <input id="delete-progress-button" type="button" className="btn btn-danger btn-block mb-4"
                           value="Delete Exercise" name={this.props.graphData.exerciseName} onClick={this.openModal} />
                         </div>
                    ) : null}
            </div>
        );

        // Provide component depending on what button was pressed
        if(this.state.form === 'Delete') {
            displayForm = (
                <div>
                    <DeleteProgressConfirm exerciseName={this.props.graphData.exerciseName} onClickAway={this.onClickAway}
                                           visible={this.state.visible}/>
                </div>
            )
        }
        if(this.state.form === 'Edit') {
            displayForm = (
                <div>
                    <Loading/>
                </div>
            )
        }

        return (
            <div>
                <div className={this.props.graphData.exerciseName.replace(/\s+/g, '-') + " graph"}></div>
                {display}

                <Modal visible={this.state.visible} width="500" height="450" effect="fadeInUp"
                       onClickAway={this.onClickAway}>
                    {displayForm}
                </Modal>

            </div>
        )
    }
}

CreateGraph.propTypes = {
    graphData: PropTypes.object.isRequired,
    deleteExercise: PropTypes.func.isRequired
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors
});

export default connect(stateToProps, {deleteExercise})(withRouter(CreateGraph));
