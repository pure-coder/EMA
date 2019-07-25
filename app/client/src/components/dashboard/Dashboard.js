import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {withRouter} from 'react-router-dom';
import {getClients, getPtData, getClientData, clearErrors, clearSuccess} from "../../actions/authenticationActions";
import ClientList from './clients/ClientList'
import Loading from "../../elements/Loading";
import ClientData from "./clients/ClientData";
import isEmpty from "../../utilities/is_empty";
import ErrorComponent from "../error/ErrorComponent";
import UserInfo from "./UserInfo";


//import * as d3 from 'd3';

class Dashboard extends Component {
    // This allows the component states to be up{dated and re-rendered)
    constructor(props) {
        // initiate props this clients
        super(props);
        this.state = {
            id: this.props.authenticatedUser.user.id,
            clients: props.authenticatedUser.clients,
            userData: undefined,
            errors: {},
            location: this.props.location.pathname,
            loaded: false
        };

        if(props.authenticatedUser.user.pt){
            props.getPtData(props.authenticatedUser.user.id, props.history)
        }
        else{
            props.getClientData(props.authenticatedUser.user.id, props.history)
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
        if(props.authenticatedUser.pt_data){
            return{
                userData: props.authenticatedUser.pt_data
            }
        }
        if(props.authenticatedUser.client_data){
            return{
                userData: props.authenticatedUser.client_data
            }
        }
        return null
    }

    // Life cycle method for react which will run when this component receives new properties
    componentDidMount() {
        document.body.scrollTo(0,0);
        this.props.clearErrors();
        this.props.clearSuccess();
        // pt get client data
        if(this.props.authenticatedUser.user.pt){
            this.props.getClients(this.state.id, this.props.history);
        }
        // else is client so set loaded to true, which calls clientData in render
        else{
            this.setState({loaded: true});
        }
    } // ComponentDidMount

    componentDidUpdate(props, state){
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
                    <h1 className=" text-center display-5">Dashboard</h1>
                    <UserInfo userData={this.state.userData}/>
                    {displayContent}
                </div>
            );
        }
    }
}

// Documents what props are needed for this component and will log a warning in the console in dev mode if not complied to
Dashboard.propTypes = {
    getPtData: PropTypes.func.isRequired,
    getClientData: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired,
    authenticatedUser: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

// Used to pull auth state and errors into this component.... DEFINED IN reducers/index.js {combineReducers} !!!! USED FOR THE REDUX STORE
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser, // authenticatedUser is set in index.js file in the reducers folder
    errors: state.errors, // errors is set in index.js file in the reducers folder
    location: state.location
});

export default connect(stateToProps, {getClients,  getPtData, getClientData, clearSuccess, clearErrors})(withRouter(Dashboard));
