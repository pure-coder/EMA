import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import { connect } from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import { withRouter } from 'react-router-dom';
import {getClientProgression} from "../../actions/authenticationActions";
import {addGraph} from '../../utilities/progressGraph'
import * as d3 from 'd3';
// import FormInputGroup from "../common/FormInputGroup"; // Allows proper routing and linking using browsers match, location, and history properties

class Dashboard2 extends Component {
    // This allows the component states to be up{dated and re-rendered
    constructor(props) {
        super(props);
        this.state = {
            client_Progression: null,
            errors: {}
        };

        this.props.getClientProgression(this.props.authenticatedUser.user.id, '5c2e2e604489901a743d87db');
    }

    static getDerivedStateFromProps(props, state) {
        if (props.authenticatedUser.client_Progression !== state.client_Progression) {
            return {client_Progression: props.authenticatedUser.client_Progression};
        }
        return null
    }

    // Life cycle method for react which will run when this component receives new properties
    componentDidMount() {
        // Check if isAuthenticated is true then redirect to the dashboard
        if (!this.props.authenticatedUser.isAuthenticated) {
            this.props.history.push('/login');
        }
    } // did mount



    render() {
        //const {errors} = this.state; // This allows errors to be pulled out of this.state with pulling them out directly

        let client_progression = this.state.client_Progression;
        // console.log(client_progression !== undefined ? client_progression[0] : null);

        // Do from dashboard on client click so this check is not needed as it would be populated
        if (client_progression !== undefined){
            client_progression.map(element => {
                let progressData = [];
                element.metrics.map(data =>{
                    return progressData.push(data);
                });
                // 1st argument takes array of objects as data to plot graph, 2nd argument takes div as position to display graph, 3rd is title of graph
                addGraph(progressData, ".progression-data", element.exerciseName);
                return null;
            });
        } // if client_progression is not undefined

        return (
            <div className="container  dashboard-custom">
                <div className="row">
                    <div className="m-auto col-md-8">
                        <h1 className=" text-center display-5">Dashboard</h1>
                        <div className="progression-data"></div>
                    </div>
                </div>
            </div>
        );
    }
}

// Documents what props are needed for this component and will log a warning in the console in dev mode if not complied to
Dashboard2.propTypes = {
    authenticatedUser: PropTypes.object.isRequired,
    getClientProgression: PropTypes.func.isRequired
    //errors: PropTypes.object.isRequired
};

// Used to pull auth state and errors into this component
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors
});

// connect must be exported with a passed parameter (not direct parameter) of Dashboard this is wrapped with withRouter
// allowing the functions of the package to be used with the component eg, proper routing, and direct parameters of
// stateToProps for the 1st parameter and the action which is dashboard as the 2nd parameter
export default connect(stateToProps, {getClientProgression})(withRouter(Dashboard2));
