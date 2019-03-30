import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {withRouter} from 'react-router-dom';
import {getClients} from "../../actions/authenticationActions";
import ClientList from './clients/ClientList'
import Loading from "../../elements/Loading";
import ClientData from "./clients/ClientData";
import isEmpty from "../../utilities/is_empty";
import ErrorComponent from "../error/ErrorComponent";


//import * as d3 from 'd3';

class Dashboard extends Component {
    // This allows the component states to be up{dated and re-rendered)
    constructor(props) {
        // initiate props this clients
        super(props);
        this.state = {
            id: this.props.authenticatedUser.user.id,
            clients: props.authenticatedUser.clients,
            errors: {},
            location: this.props.location.pathname,
            loaded: false
        }
    }

    // Set clients in state to those retrieved from database (from props), as on refresh state clients will always be undefined
    static getDerivedStateFromProps(props, state) {
        if (props.authenticatedUser.clients !== state.clients) {
            return {
                clients: props.authenticatedUser.clients,
                errors: props.errors,
                loaded: true
            }
        }
        return null
    }

    // Life cycle method for react which will run when this component receives new properties
    componentDidMount() {
        document.body.scrollTo(0,0);
        // pt get client data
        if(this.props.authenticatedUser.user.pt){
            this.props.getClients(this.state.id, this.props.history);
        }
        // else is client so set loaded to true, which calls clientData in render
        else{
            this.setState({loaded: true});
        }
    } // ComponentDidMount

    componentDidUpdate(){
    }

    render() {
        if (!this.state.loaded) {
            return <Loading/>
        }
        if(isEmpty(this.props.authenticatedUser.user)){
            return <ErrorComponent/>
        }
        else {
            let displayContent;

            // If user is a PT then display pt dashboard of clients
            if (this.props.authenticatedUser.user.pt && this.state.clients !== undefined) {

                if (this.state.clients === undefined) {
                    return <Loading/>
                }
                // Define content to display.. in this case the list of clients
                displayContent = (
                    // send clients data to client component, and render client component
                    <div className="container  dashboard-custom">
                        <ClientList clients={this.state.clients}/>
                    </div>
                )
            } // If PT

            // If user is not a PT then display dashboard of client data
            if (!this.props.authenticatedUser.user.pt) {
                // Define content to display..
                displayContent = (
                    // send clients data to client component, and render client component
                    <div className="container  dashboard-custom client">
                        <ClientData/>
                    </div>
                )
            } // If PT

            return (
                <div className="dashboard-container">
                    {displayContent}
                </div>
            );
        }
    }
}

// Documents what props are needed for this component and will log a warning in the console in dev mode if not complied to
Dashboard.propTypes = {
    authenticatedUser: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

// Used to pull auth state and errors into this component.... DEFINED IN reducers/index.js {combineReducers} !!!! USED FOR THE REDUX STORE
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser, // authenticatedUser is set in index.js file in the reducers folder
    errors: state.errors, // errors is set in index.js file in the reducers folder
    location: state.location
});

export default connect(stateToProps, {getClients})(withRouter(Dashboard));
