import {connect} from 'react-redux';
import React, {Component} from 'react';
import {addGraph} from "../../utilities/progressGraph";
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import $ from 'jquery';
import isEmpty from "../../validation/is_empty";

class Graph extends Component {
    // This allows the component states to be up{dated and re-rendered)
    constructor(props) {
        super(props);
        this.state = {
            graphData: this.props.graphData,
            exercises : {},
            errors: {},
            mounted: false,
        }
        this.createGraph = this.createGraph.bind(this);
    }

    sortedProgressionMap(data){
        return data.sort((obj1, obj2) => {
            return new Date(obj1.Date) - new Date(obj2.Date);
        });
    }; // sortedMap

    componentDidMount(){
        this.createGraph();
    } // cdm

    componentDidUpdate(prevProps) {
        // Check to see if graphData is an array and that it is not empty
        if (Array.isArray(this.props.graphData) && !isEmpty(this.props.graphData)) {
            this.props.graphData.map((element, index) => {
                // Make sure that the exercise names match before comparing the metrics
                if (prevProps.graphData[index].exerciseName === element.exerciseName) {
                    // If data has been changed for exercise update the graph for the exercise
                    if (prevProps.graphData[index].metrics.length !== element.metrics.length) {
                        // Replace spaces with hyphens
                        let exerciseId = element.exerciseName.replace(/\s+/g, '-');
                        // Remove
                        let pageElement = document.getElementById(exerciseId);
                        pageElement.parentNode.removeChild(pageElement);
                        let metrics = this.sortedProgressionMap(element.metrics);

                        // Update the graph on page - 1st argument is data to show, 2nd is exercise name (no spaces), 3rd is boolean to indicate
                        // that it is an update
                        this.createGraph(metrics, exerciseId, true);
                    }
                }
                return null;
            });
        }
    }

    shouldComponentUpdate(prevProps){
        return prevProps.graphData !== this.props.graphData;
    }

    createGraph(data, exerciseName, updated){

        // Check to see if this is a call for graph to be updated.
        if(!updated) {
            if (Array.isArray(this.state.graphData) && !isEmpty(this.state.graphData)) {
                this.state.graphData.map(element => {
                    let progressData = [];
                    let merge;
                    this.sortedProgressionMap(element.metrics).map(data => {
                        return progressData.push(data)
                    });

                    // Only create graph for exercise that has 2+ metric data
                    if (element.metrics.length >= 2) {
                        let className = element.exerciseName.toString();
                        let addToClassName;
                        // Check if element already exists, only create and add class to div if it doesn't
                        if (!($('.' + className).length > 0)) {
                            // Replace space ' ' with hyphen '-' in string
                            addToClassName = className.replace(/\s+/g, '-');
                            console.log(addToClassName)
                            let newNode = document.createElement('div');
                            newNode.className = addToClassName;
                            document.getElementById('Progression').appendChild(newNode);

                            // Create heading for graph
                            let title = className
                            let heading = document.createElement('h4');
                            let headingText = document.createTextNode(title)
                            document.getElementsByClassName(addToClassName)[0].appendChild(heading).appendChild(headingText);
                        }

                        // Create object to merge into exercise state
                        let exercise = {
                            [element.exerciseName]: progressData
                        }
                        merge = Object.assign(this.state.exercises, exercise);
                        this.setState({exercises: merge})

                        // 1st argument takes array of objects as data to plot graph, 2nd argument takes div as position to display graph
                        return addGraph(progressData, "." + addToClassName);
                    }
                    return null;
                });
                this.setState({mounted: true});
            }
        }
        else{

            return addGraph(data, "." + exerciseName);
        }
    }

    render() {
        return (
                <div className="row">
                    <div className="m-auto col-1">
                        <h1 className=" text-center display-5 mb-3">Dashboard</h1>
                        <h2 className=" text-center display-5 mt-3 mb-4">Client progression data</h2>
                        <div id="Progression" className="Progression">
                        </div>
                    </div>
                </div>
        );
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
