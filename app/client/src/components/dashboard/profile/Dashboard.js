import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux'; // Needed when using redux inside a component (connects redux to this component)
import {withRouter} from 'react-router-dom';
import {
    ptGetClients,
    ptGetData,
    ptNextWorkouts
} from "../../../actions/ptProfileActions";
import {
    clientGetData,
    clientNextWorkouts
} from "../../../actions/clientProfileActions";
import ClientList from '../clients/ClientList'
import Loading from "../../common/Loading/Loading";
import ClientData from "../clients/ClientData";
import isEmpty from "../../../utilities/is_empty";
import ErrorComponent from "../../error/ErrorComponent";
import UserInfo from "./UserInfo";
import checkExp from '../../../utilities/checkExp'
import NextWorkouts from "../../common/Workout/NextWorkouts";

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
            userData: null,
            clients: null,
            nextWorkouts: null
        };
    }

    componentDidUpdate(prevProps, prevState){
        const {isAuthenticated, user} = this.props.authenticatedUser;
        const {pt_data, clients, pt_next_workouts} = this.props.ptProfile;
        const {client_data, client_next_workouts} = this.props.clientProfile;

        if(isAuthenticated && user.pt){
            if(prevProps.ptProfile.pt_data !== prevState.userData){
                this.setState({
                    userData: pt_data,
                });
            }
            if(prevProps.ptProfile.clients !== prevState.clients){
                this.setState({
                    clients: clients
                });
            }
            if(prevProps.ptProfile.pt_next_workouts !== prevState.nextWorkouts){
                this.setState({
                    nextWorkouts: pt_next_workouts
                });
            }
        }
        else{
            if(prevProps.clientProfile.client_data !== this.state.userData) {
                this.setState({
                    userData: client_data,
                });
            }
            if(prevProps.clientProfile.client_next_workouts !== this.state.nextWorkouts){
                this.setState({
                    nextWorkouts: client_next_workouts
                });
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
            this.props.ptNextWorkouts();
        }
        else{
            this.props.clientGetData();
            this.props.clientNextWorkouts();
        }
        document.body.scrollTo(0,0);
    } // ComponentDidMount

    render() {
        let displayContent;
        const {user, isAuthenticated} = this.props.authenticatedUser;
        const {clients, pt_data, pt_next_workouts} = this.props.ptProfile;
        const {client_data, client_next_workouts} = this.props.clientProfile;


        if(user.pt){
            if(!isAuthenticated){
                return <ErrorComponent/>
            }
            if (pt_data === null){
                return <Loading myClassName="loading_container"/>
            }
            if (clients === null){
                return <Loading myClassName="loading_container"/>
            }
            if (pt_next_workouts === null){
                return <Loading myClassName="loading_container"/>
            }
            else {
                // Define content to display.. in this case the list of clients
                displayContent = (
                    // send clients data to client component, and render client component
                    <div className="dashboard-custom">
                        <div className="row dashboard_top_row">
                            <div className="dashboard_row">
                                <UserInfo userData={pt_data}/>
                                <NextWorkouts nextWorkouts={pt_next_workouts}/>
                            </div>
                        </div>
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
                        <div className="row dashboard_top_row">
                            <div className="dashboard_row">
                                <UserInfo userData={client_data}/>
                                <NextWorkouts nextWorkouts={client_next_workouts}/>
                                <ClientData clientData={client_data}/>
                            </div>
                        </div>
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
    ptNextWorkouts,
    clientNextWorkouts
})(withRouter(Dashboard));
