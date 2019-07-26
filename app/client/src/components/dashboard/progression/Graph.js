import {connect} from 'react-redux';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import CreateGraph from './CreateGraph';
import isEmpty from "../../../utilities/is_empty";
import ErrorComponent from "../../error/ErrorComponent";
import Loading from "../../../elements/Loading";

class Graph extends Component {
    // This allows the component states to be up{dated and re-rendered)
    constructor(props) {
        super(props);
        this.state = {
            graphData: props.graphData,
            errors: {},
            loaded: false
        };
    }

    static getDerivedStateFromProps(props, state){
        if(props.graphData === state.graphData){
            return {
                graphData: props.graphData,
                loaded: true,
            }
        }
        if(props.errors !== state.errors){
            return {
                errors: props.errors,
            }
        }
        return null;
    }

    componentDidMount(){
    }

    componentDidUpdate(prevProps){
        if (prevProps.graphData !== this.props.graphData){
            this.setState({graphData: this.props.graphData});
        }
    }

    sortedProgressionExerciseNames(graphData){
        return graphData.sort((obj1, obj2) => {
            if (obj1.exerciseName > obj2.exerciseName) {
                return 1;
            }
            if (obj1.exerciseName < obj2.exerciseName){
                return -1;
            }
            return 0;
        });
    }; // sortedMap

    render() {
        if(!this.state.loaded){
            return <Loading/>
        }
        if(isEmpty(this.props.authenticatedUser.user)){
            return <ErrorComponent/>
        }
        else{

            let graphData = this.sortedProgressionExerciseNames(this.state.graphData);
            const graphs = graphData.map(graph => {
                if(graph.metrics.length > 1){
                    return (
                        // Changed key from CreateGraph to div as div was first child, otherwise error was given.
                        <div className="graphs mb-5" key={graph._id}>
                            <CreateGraph graphData={graph}/>
                        </div>
                    )
                }
                else {
                    return null;
                }
            });
            // Check if any exercises are greater than 1 (not null) if so only show that exercise, else tell user no exercises to show
            let data = false;
            graphs.forEach((value)=>{
                if(value !== null){
                    data = true;
                }
            });
            if(data){
                return (
                    <div id="Progression" className="Progression">
                        {graphs}
                    </div>
                );
            }
            else{
                // If progression data entry is 1 or less then indicate that data exists but not enough to plot on a graph.
                return (
                    <div id="Progression" className="Progression">
                        <h2 className="text-center text-info mt-5">Data exists for 1 or more exercises but not enough to plot a graph...</h2>
                    </div>
                )
            }
        }
    }
}

Graph.propTypes = {
    graphData: PropTypes.array.isRequired
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors
});

export default connect(stateToProps, null)(withRouter(Graph));
