import {connect} from 'react-redux';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import CreateGraph from './CreateGraph';

class Graph2 extends Component {
    // This allows the component states to be up{dated and re-rendered)
    constructor(props) {
        super(props);
        this.state = {
            graphData: props.graphData
        };
    }

    componentDidUpdate(prevProps){
        if (prevProps.graphData !== this.props.graphData){
            this.setState({graphData: this.props.graphData});
        }
    }

    render() {

        const graphs = this.state.graphData.map(graph => (
            // Changed key from CreateGraph to div as div was first child, otherwise error was given.
            <div className="graphs" key={graph._id}>
                <CreateGraph graphData={graph}/>
            </div>
            )
        );

        return (
            <div id="Progression" className="Progression">
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
