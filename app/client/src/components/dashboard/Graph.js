import {connect} from 'react-redux';
import React, {Component} from 'react';
import {addGraph} from "../../utilities/progressGraph";
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import $ from 'jquery';

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

    componentDidMount(){
        this.createGraph();
    } // cdm

    componentDidUpdate(prevProps){
        //this.createGraph();
        // console.log(prevProps.graphData);
        // console.log(this.props.graphData); // this changes (was other way around in shouldComponentUpdate - has to do with rendering cycle)
        this.props.graphData.map((element, index) => {
            // if(prevProps.graphData !== this.props.graphData){
            //     console.log(this.props.graphData)
            // }
            // console.log(prevProps.graphData[index]);
            // console.log(element);
            if(prevProps.graphData[index].metrics.length !== element.metrics.length){
                console.log(element.exerciseName);
            }
            return null;
        });
    }

    shouldComponentUpdate(prevProps){
        return prevProps.graphData !== this.props.graphData;
    }

    createGraph(){
        const sortedProgressionMap = (data) => {
            return data.sort((obj1, obj2) => {
                return new Date(obj1.Date) - new Date(obj2.Date);
            });
        }; // sortedMap

        this.state.graphData.map(element => {
            let progressData = [];
            let merge;
            sortedProgressionMap(element.metrics).map(data => {
                return progressData.push(data)
            });

            // Only create graph for exercise that has 2+ metric data
            if(element.metrics.length >= 2) {
                let addToClassName = element.exerciseName.toString();
                // Check if element already exists, only create and add class to div if it doesn't
                if (!($('.'+ addToClassName).length > 0)){
                    // Replace space ' ' with hyphen '-' in string
                    addToClassName = addToClassName.replace(/\s+/g, '-');
                    let newNode = document.createElement('div');
                    newNode.className = addToClassName;
                    document.getElementById('Progression').appendChild(newNode);
                }

                // Create object to merge into exercise state
                let exercise = {
                    [element.exerciseName] : progressData
                }
                merge = Object.assign(this.state.exercises, exercise);
                this.setState({exercises: merge})

                // 1st argument takes array of objects as data to plot graph, 2nd argument takes div as position to display graph,
                // 3rd is title of graph
                return addGraph(progressData, "."+addToClassName, element.exerciseName);
            }
            return null;
        });
        this.setState({mounted: true});
    }

    render() {
        return (
                <div className="row">
                    <div className="m-auto col-1">
                        <h1 className=" text-center display-5 mb-3">Dashboard</h1>
                        <h2 className=" text-center display-5 mt-3 mb-4">Client progression data</h2>
                        <div id="Progression" className="Progression">
                            <div className="progression-data"></div>
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
