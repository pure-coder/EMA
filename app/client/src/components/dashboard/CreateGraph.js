import React, {Component} from 'react';
import {addGraph} from "../../utilities/drawProgressGraph";
import {deleteExercise} from "../../actions/authenticationActions";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router-dom";

class CreateGraph extends Component {
    constructor(props){
        super(props);
        this.state = {
            userId : props.match.params.uid || props.authenticatedUser.user.id,
            clientId: props.authenticatedUser.clientId || props.match.params.cid,
        }
        this.deleteExercise = this.deleteExercise.bind(this);
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
        if(prevProps.graphData.metrics.length !== this.props.graphData.metrics.length) {
            this.drawGraph(true)
        }
    }

    deleteExercise(e){
        this.props.deleteExercise(this.state.userId, this.state.clientId, e.target.name, this.props.history);
    }

    render(){

        let display = (
            <div className="progress-buttons">
                {this.props.authenticatedUser.user.pt === true && this.props.authenticatedUser.client_Progression ?

                    <input id="edit-progress-button" type="button" className="btn btn-info btn-block mb-4"
                           value="Edit Exercise" onClick={this.openModal} />
                    : null }
                {this.props.authenticatedUser.user.pt === true && this.props.authenticatedUser.client_Progression ?
                    <input id="delete-progress-button" type="button" className="btn btn-danger btn-block mb-4"
                           value="Delete Exercise" name={this.props.graphData.exerciseName} onClick={this.deleteExercise} />
                    :null }
            </div>
        );

        return (
            <div>
                <div className={this.props.graphData.exerciseName.replace(/\s+/g, '-') + " graph"}></div>
                {display}
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
