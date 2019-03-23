import {connect} from 'react-redux';
import React, {Component} from 'react';
//import {addGraph} from "../../utilities/drawProgressGraph";
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
//import $ from 'jquery';
//import isEmpty from "../../validation/is_empty";
import CreateGraph from './CreateGraph';

class Graph2 extends Component {
    // This allows the component states to be up{dated and re-rendered)
    constructor(props) {
        super(props);
        this.state = {
            exercises : {},
            errors: {},
            mounted: false,
        };
        //this.createGraph = this.createGraph.bind(this);
        // this.editButton = this.editButton.bind(this);
    }

    sortedProgressionMap(data){
        return data.sort((obj1, obj2) => {
            return new Date(obj1.Date) - new Date(obj2.Date);
        });
    }; // sortedMap



    render() {

        const graphs = this.props.graphData.map(graph => (
            // Changed key from CreateGraph to div as div was first child, otherwise error was given.
            <div className="graphs" key={graph._id}>
                <CreateGraph data={graph}/>
            </div>
            )
        );

        return (
            <div id="Progression" className="Progression">
                {console.log(1)}
                {graphs}
            </div>
        );
    }
}

Graph2.propTypes = {
    graphData: PropTypes.array.isRequired
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors
});

export default connect(stateToProps, null)(withRouter(Graph2));
