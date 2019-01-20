import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {getClients} from "../../actions/dashboardActions"; // Used to get clients of personal trainers from db and set to state
import { connect } from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import { withRouter } from 'react-router-dom';
import ClientList from './ClientList'
//import * as d3 from 'd3';

class Dashboard extends Component {
    // This allows the component states to be up{dated and re-rendered)
    constructor(props) {
        // initiate props this clients
        super(props);
        this.state = {
            id: this.props.authenticatedUser.user.id,
            clients: this.props.getClients(this.props.authenticatedUser.user.id),
            errors: {}
        }
    }

    // Life cycle method for react which will run when this component receives new properties
    componentDidMount() {
        // Check if isAuthenticated is true then redirect to the dashboard
        if (!this.props.authenticatedUser.isAuthenticated) {
            this.props.history.push('/login');
        }

    } // ComponentDidMount

    render() {
        // Get clients from pt client list via redux
        let clients = this.state.clients
        console.log(clients)
        let displayContent;

        // If user is a PT then display pt dashboard of clients
        if(this.props.authenticatedUser.user.pt){
            displayContent = (
                // send clients data to client component, and render client component
                <ClientList clients={clients}/>
            )
        } // If PT

        return (
                <div className="container  dashboard-custom">
                    <div className="row">
                        <div className="m-auto col-md-10">
                            <h1 className=" text-center display-5">Dashboard</h1>
                            {displayContent}
                        </div>
                    </div>
                </div>
        );
    }
}

// Documents what props are needed for this component and will log a warning in the console in dev mode if not complied to
Dashboard.propTypes = {
    authenticatedUser : PropTypes.object.isRequired,
    getClients: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
}


// Used to pull auth state and errors into this component.... DEFINED IN reducers/index.js {combineReducers}
const stateToProps = (state) => ({
        authenticatedUser: state.authenticatedUser,
        clients: state.clients,
        errors: state.errors
    });

export default connect(stateToProps, {getClients})(withRouter(Dashboard));
