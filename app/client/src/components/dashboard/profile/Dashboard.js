import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux'; // Needed when using redux inside a component (connects redux to this component)
import {withRouter} from 'react-router-dom';
import {
    ptGetClients,
    ptGetData,
} from "../../../actions/ptProfileActions";
import {
    clientGetData,
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
            userData: null,
            clients: null,
            ProfilePicUrl: null
        };
    }

    componentDidUpdate(prevProps, prevState){
        const {isAuthenticated, user} = this.props.authenticatedUser;
        const {pt_data, clients} = this.props.ptProfile;
        const {client_data} = this.props.clientProfile;

        if(isAuthenticated && user.pt){
            if(prevProps.ptProfile.pt_data !== prevState.userData){
                this.setState({
                    userData: pt_data,
                    ProfilePicUrl: pt_data.ProfilePicUrl
                });
            }
            if(prevProps.ptProfile.clients !== prevState.clients){
                this.setState({
                    clients: clients
                });
            }
        }
        else{
            if(prevProps.clientProfile.client_data !== this.state.userData) {
                this.setState({
                    userData: client_data,
                    ProfilePicUrl: client_data.ProfilePicUrl
                })
            }
        }
    }


    // Life cycle method for react which will run when this component receives new properties
    componentDidMount() {
        const {isAuthenticated} = this.props.authenticatedUser;
        if(!isAuthenticated)
            this.props.history.push('/login');
        checkExp();
        // Check to see if data is already loaded, increases performance
        if(this.props.authenticatedUser.user.pt){
            this.props.ptGetData();
            this.props.ptGetClients();
        }
        else{
            this.props.clientGetData();
        }
        document.body.scrollTo(0,0);
    } // ComponentDidMount

    render() {
        let displayContent;
        const {user, isAuthenticated} = this.props.authenticatedUser;
        const {clients, pt_data} = this.props.ptProfile;
        const {client_data} = this.props.clientProfile;

        if(user.pt){
            if(!isAuthenticated){
                return <ErrorComponent/>
            }
            if (pt_data === null && clients === null){
                return <Loading myClassName="loading_container"/>
            }
            else {
                // Define content to display.. in this case the list of clients
                displayContent = (
                    // send clients data to client component, and render client component
                    <div className="dashboard-custom">
                        <UserInfo userData={pt_data}/>
                        <ClientList ptData={pt_data} clients={clients}/>
                    </div>
                )
            }
        } //if user is pt
        else{
            if (client_data === null) {
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
                        <UserInfo userData={client_data}/>
                        <ClientData clientData={client_data}/>
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

};

// Used to pull auth state and errors into this component.... DEFINED IN reducers/index.js {combineReducers} !!!! USED FOR THE REDUX STORE
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser, // authenticatedUser is set in index.js file in the reducers folder
    ptProfile: state.ptProfile,
    clientProfile: state.clientProfile,
    errors: state.errors, // errors is set in index.js file in the reducers folder
});

export default connect(stateToProps, {
    ptGetClients,
    ptGetData,
    clientGetData,
})(withRouter(Dashboard));
