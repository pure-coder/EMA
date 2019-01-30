import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import { connect } from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import { withRouter } from 'react-router-dom';
import {getClients} from "../../actions/authenticationActions";
import ClientList from './ClientList'
//import * as d3 from 'd3';

class Dashboard extends Component {
    // This allows the component states to be up{dated and re-rendered)
    constructor(props) {
        // initiate props this clients
        super(props);
        this.state = {
            id: this.props.authenticatedUser.user.id,
            clients: {},
            errors: {}
        }
    }

    // Set clients in state to those retrieved from database (from props), as on refresh state clients will always be undefined
    static getDerivedStateFromProps(props, state){
        if (props.authenticatedUser.clients !== state.clients){
            return {clients: props.authenticatedUser.clients}
        }
        return null
    }

    // Life cycle method for react which will run when this component receives new properties
    componentDidMount() {
        // Check if isAuthenticated is true then redirect to the dashboard
        if (!this.props.authenticatedUser.isAuthenticated) {
            this.props.history.push('/login');
        }

        this.update()

    } // ComponentDidMount

    // update client list after change
    update(){
        // Get updated client list from database
        this.props.getClients(this.state.id)
    }
    
    render() {
        let displayContent;
        // If user is a PT then display pt dashboard of clients
        if(this.props.authenticatedUser.user.pt && this.state.clients !== undefined){
            // Get clients from pt client list via redux
            let clients = this.state.clients;
            // console.log("clients", clients);

            // Define content to display.. in this case the list of clients
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
    errors: PropTypes.object.isRequired
};

// Used to pull auth state and errors into this component.... DEFINED IN reducers/index.js {combineReducers}
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser, // authenticatedUser is set in index.js file in the reducers folder
    errors: state.errors // errors is set in index.js file in the reducers folder
});

export default connect(stateToProps, {getClients})(withRouter(Dashboard));
