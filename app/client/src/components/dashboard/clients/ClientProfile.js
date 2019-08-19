import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {withRouter} from 'react-router-dom';
import {
    ptGetCurrentClient,
    ptGetClientProgression,
    ptGetClientBodyBio,
    ptGetClientProfileNotes,
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
import Graphs from "../progression/Graphs";
// import NewClientProgressForm from "../progression/NewClientProgressForm";
// import Modal from 'react-awesome-modal';
import isEmpty from '../../../utilities/is_empty';
import ErrorComponent from "../../error/ErrorComponent";
import Loading from "../../../elements/Loading";
import UserInfo from "../profile/UserInfo";
import ProfileNotes from "../profileNotes/ProfileNotes";
import BodyGraphs from "../bodyBio/BodyGraphs";
import checkExp from "../../../utilities/checkExp";

// import FormInputGroup from "../common/FormInputGroup"; // Allows proper routing and linking using browsers match, location, and history properties

class ClientProfile extends Component {
    // This allows the component states to be up{dated and re-rendered
    constructor(props) {
        super(props);
        this.state = {
            client_progression: props.authenticatedUser.user.pt ? props.ptProfile.client_progression :
                props.clientProfile.client_progression,
            body_bio: props.authenticatedUser.user.pt ? props.ptProfile.body_bio :
                props.clientProfile.body_bio,
            userId: props.authenticatedUser.user.id,
            clientId: props.authenticatedUser.user.pt ? props.match.params.cid : props.authenticatedUser.user.id,
            clientData: props.authenticatedUser.user.pt ? props.ptProfile.current_client :
                props.clientProfile.client_data,
            loaded: false,
            errors: {},
        };
    }


    componentDidMount() {
        const {isAuthenticated} = this.props.authenticatedUser;
        if(!isAuthenticated)
            this.props.history.push('/login');
        checkExp();
        if(this.props.authenticatedUser.user.pt){
            this.props.ptGetCurrentClient(this.state.clientId, this.props.history);
            this.props.ptGetClientProgression(this.state.clientId, this.props.history);
            this.props.ptGetClientBodyBio(this.state.clientId, this.props.history);
            this.props.ptGetClientProfileNotes(this.state.clientId, this.props.history);
        }
        else{
            this.props.clientGetData(this.state.clientId, this.props.history);
            this.props.clientGetBodyBio(this.state.clientId, this.props.history);
            this.props.clientGetProfileNotes(this.state.clientId, this.props.history);
            this.props.clientGetProgression(this.state.clientId, this.props.history);
        }
    } // did mount

    componentWillUnmount(){
        const {isAuthenticated} = this.props.authenticatedUser;
        if(!isAuthenticated){
            this.props.history.push('/re-login');
        }
        // This got rid of the Date: null bug for now, need to find route cause!!!
        else if(this.props.authenticatedUser.user.pt){
            this.props.ptClearCurrentClient(this.state.clientId, this.props.history);
            this.props.ptClearClientProgression(this.state.clientId, this.props.history);
            this.props.ptClearClientBodyBio(this.state.clientId, this.props.history);
            this.props.ptClearClientProfileNotes(this.state.clientId, this.props.history);
        }
        else{
            this.props.clientClearData(this.state.clientId, this.props.history);
            this.props.clientClearBodyBio(this.state.clientId, this.props.history);
            this.props.clientClearProfileNotes(this.state.clientId, this.props.history);
            this.props.clientClearProgression(this.state.clientId, this.props.history);

        }

    }

    render() {
        const {user} = this.props.authenticatedUser;
        const client_data = this.state.clientData;
        const clientProgressData = this.state.client_progression;
        const bodyProgressData = this.state.body_bio;
        // const ProfilePicUrl =

        let profile_notes;

        if(user.pt){
            profile_notes = this.props.ptProfile.profile_notes;
        }
        else{
            profile_notes = this.props.clientProfile.profile_notes;
        }

        if(client_data === null || client_data === undefined || profile_notes === null){
            return <Loading myClassName="loading_container"/>
        }
        if(isEmpty(user)){
            return <ErrorComponent/>
        }
        else{
            return (
                <div className="client-profile">
                    <h1 className=" text-center display-5 mb-3">Client Profile</h1>
                    <UserInfo userData={this.state.clientData}/> {/* Use data from props.location.state*/}
                    <div className="row">
                        <div className="col-sm Profile_margin">
                            <BodyGraphs bodyGraphData={bodyProgressData}/>
                            <Graphs graphData={clientProgressData}/>
                        </div>
                        <div className="col-sm">
                            <ProfileNotes data={profile_notes}/>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

// Documents what props are needed for this component and will log a warning in the console in dev mode if not complied to
ClientProfile.propTypes = {
    authenticatedUser: PropTypes.object.isRequired,
    ptProfile: PropTypes.object.isRequired,
    clientProfile: PropTypes.object.isRequired,

    // Get PT client data
    getCurrentClient: PropTypes.func.isRequired,
    ptGetClientBodyBio: PropTypes.func.isRequired,
    ptGetClientProgression: PropTypes.func.isRequired,
    ptGetProfileClientNotes: PropTypes.func.isRequired,

    // Clear PT client data
    ptClearCurrentClientProfile: PropTypes.func.isRequired,
    ptClearClientBodyBio: PropTypes.func.isRequired,
    ptClearProgression: PropTypes.func.isRequired,
    ptClearClientProfileNotes: PropTypes.func.isRequired,

    // Client get data
    clientGetData: PropTypes.func.isRequired,
    clientGetBodyBio: PropTypes.func.isRequired,
    clientGetProgression: PropTypes.func.isRequired,
    clientGetProfileNotes: PropTypes.func.isRequired,
    
    // Client clear data
    clientClearData: PropTypes.func.isRequired,
    clientClearBodyBio: PropTypes.func.isRequired,
    clientClearProgression: PropTypes.func.isRequired,
    clientClearProfileNotes: PropTypes.func.isRequired,
};

// Used to pull auth state and errors into this component
const stateToProps = (state) => {
    return {
        authenticatedUser: state.authenticatedUser,
        clientProfile: state.clientProfile,
        ptProfile: state.ptProfile,
        errors: state.errors
}};

export default connect(stateToProps, {ptGetCurrentClient,
    ptGetClientProgression,
    ptGetClientBodyBio,
    ptGetClientProfileNotes,
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
    clientClearProfileNotes,})(withRouter(ClientProfile));
