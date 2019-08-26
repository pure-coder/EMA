import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux'; // Needed when using redux inside a component (connects redux to this component)
import {withRouter} from 'react-router-dom';
import {
    ptGetClients,
    ptGetData,
    clearErrors,
    clearSuccess,
    ptClearCurrentClientProfile,
    ptClearClientProgression,
    ptClearClientBodyBio,
    ptClearClientProfileNotes,
} from "../../../actions/ptProfileActions";
import {
    clientGetData,
    clientGetProgression,
    clientGetBodyBio,
    clientGetProfileNotes,
    clientClearProfile,
    clientClearProgression,
    clientClearBodyBio,
    clientClearProfileNotes,
} from "../../../actions/clientProfileActions";
import ClientList from '../clients/ClientList'
import Loading from "../../../elements/Loading";
import ClientData from "../clients/ClientData";
import isEmpty from "../../../utilities/is_empty";
import ErrorComponent from "../../error/ErrorComponent";
import UserInfo from "./UserInfo";
import checkExp from '../../../utilities/checkExp'

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            clientData: null,
            ptData: null,
            ptClients: null
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        // const {isAuthenticated, user} = this.props.authenticatedUser;
        // const {ptData, clientData} = this.state;
        // const {ptProfile} = this.props;
        // const {clientProfile} = this.props;
        //
        // if(isAuthenticated && user.pt){
        //     if(ptData === null && ptProfile.pt_data !== null && ptProfile.clients !== null){
        //         this.setState({
        //             ptData: ptProfile,
        //             ptClients: ptProfile.clients
        //         });
        //     }
        // }
        // else if(clientData === null && clientProfile.client_data !== null){
        //     this.setState({
        //         clientData: clientProfile,
        //     });
        // }
        console.log(prevProps);
        // console.log(pt_data);
        console.log(prevState);
    }


    // Life cycle method for react which will run when this component receives new properties
    componentDidMount() {
        const {isAuthenticated} = this.props.authenticatedUser;
        if(!isAuthenticated)
            this.props.history.push('/login');
        checkExp();
        // Check to see if data is already loaded, increases performance
        if(this.props.authenticatedUser.user.pt){
            this.props.ptGetData(this.props.history);
            this.props.ptGetClients(this.props.history);
        }
        else{
            this.props.clientGetData(this.props.authenticatedUser.user.id);
        }
        document.body.scrollTo(0,0);
    } // ComponentDidMount

    render() {
        let displayContent;
        const {user, isAuthenticated} = this.props.authenticatedUser;
        const {ptData, ptClients, clientData} = this.state;

        if(user.pt){
            if(!isAuthenticated){
                return <ErrorComponent/>
            }
            if (ptData === null && ptClients === null) {
                return <Loading myClassName="loading_container"/>
            }
            else {
                // Define content to display.. in this case the list of clients
                displayContent = (
                    // send clients data to client component, and render client component
                    <div className="dashboard-custom">
                        <UserInfo userData={ptData.pt_data}/>
                        <ClientList ptData={ptData}/>
                    </div>
                )
            }
        } //if user is pt
        else{
            if (clientData === null) {
                return <Loading myClassName="loading_container"/>
            }
            if(isEmpty(user)){
                return <ErrorComponent/>
            }
            else {
                // Define content to display..
                displayContent = (
                    // send clients data to client component, and render client component
                    <div className="dashboard-custom client">
                        <UserInfo userData={clientData.client_data}/>
                        <ClientData clientData={clientData.client_data}/>
                    </div>
                )
            }
        }

        return (
            <div className="dashboard-container">
                <h1 className=" text-center display-5 mb-3">Dashboard</h1>
                {displayContent}
            </div>
        );
    }
}

// Documents what props are needed for this component and will log a warning in the console in dev mode if not complied to
Dashboard.propTypes = {
    authenticatedUser: PropTypes.object.isRequired,
    ptProfile: PropTypes.object.isRequired,
    clientProfile: PropTypes.object.isRequired,

    // PT data
    ptGetClients: PropTypes.func.isRequired,
    ptGetData: PropTypes.func.isRequired,

    // Client data
    clientGetData: PropTypes.func.isRequired,

    clearSuccess: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
};

// Used to pull auth state and errors into this component.... DEFINED IN reducers/index.js {combineReducers} !!!! USED FOR THE REDUX STORE
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser, // authenticatedUser is set in index.js file in the reducers folder
    ptProfile: state.ptProfile,
    clientProfile: state.clientProfile,
    errors: state.errors, // errors is set in index.js file in the reducers folder
    location: state.location
});

export default connect(stateToProps, {
    ptGetClients,
    ptGetData,
    clearSuccess,
    clearErrors,
    ptClearCurrentClientProfile,
    ptClearClientProgression,
    ptClearClientBodyBio,
    ptClearClientProfileNotes,
    clientGetData,
    clientGetProgression,
    clientGetBodyBio,
    clientGetProfileNotes,
    clientClearProfile,
    clientClearProgression,
    clientClearBodyBio,
    clientClearProfileNotes,
})(withRouter(Dashboard));
