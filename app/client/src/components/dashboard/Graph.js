import {connect} from 'react-redux';
import React, {Component} from 'react';
import {addGraph} from "../../utilities/progressGraph";
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';


class Graph extends Component {
    // This allows the component states to be up{dated and re-rendered)
    constructor(props) {
        super(props);
        this.state = {
            errors: {}
        }
    }

    componentDidMount(){
        const sortedProgressionMap = (data) => {
            return data.sort((obj1, obj2) => {
                return new Date(obj1.Date) - new Date(obj2.Date);
            });
        }; // sortedMap

        this.props.graphData.map(element => {
            let progressData = [];
            sortedProgressionMap(element.metrics).map(data => {
                return progressData.push(data)
            });
            // 1st argument takes array of objects as data to plot graph, 2nd argument takes div as position to display graph, 3rd is title of graph
            //console.log(progressData)
            return addGraph(progressData, ".progression-data", element.exerciseName);
        });
    } // cdm

    render() {
        return (
                <div className="row">
                    <div className="m-auto col-md-8">
                        <h1 className=" text-center display-5 mb-3">Dashboard</h1>
                        <div className="Progression">
                            <h2 className=" text-center display-5 mt-3 mb-4">Client progression data</h2>
                            <div className="progression-data">

                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}

Graph.propTypes = {
    graphData: PropTypes.array.isRequired
}

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors
});

export default connect(stateToProps, null)(withRouter(Graph));
