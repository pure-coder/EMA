import React, {Component} from 'react';
import {addGraph} from "../../utilities/drawProgressGraph";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router-dom";

class CreateGraph extends Component {

    sortedProgressionMap(graphData){
        return graphData.sort((obj1, obj2) => {
            return new Date(obj1.Date) - new Date(obj2.Date);
        });
    }; // sortedMap

    drawGraph(isUpdate){
        let exerciseToId = this.props.graphData.exerciseName.replace(/\s+/g, '-');
        const metrics = this.sortedProgressionMap(this.props.graphData.metrics)
        // Graph is drawn here. Had to make sure className in return was rendered 1st before calling this function
        // as it needs it to append on too.
        addGraph(metrics, '.' + exerciseToId, this.props.graphData.exerciseName, isUpdate);
    }

    componentDidMount(){
        this.drawGraph(false);
    }

    componentDidUpdate(prevProps){
        if(prevProps.graphData !== this.props.graphData) {
            this.drawGraph(true)
        }
    }

    render(){

        return (
            <div className={this.props.graphData.exerciseName.replace(/\s+/g, '-') + " graph"}>
            </div>
        )
    }
}

CreateGraph.propTypes = {
    graphData: PropTypes.object.isRequired
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors
});

export default connect(stateToProps, null)(withRouter(CreateGraph));
