import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {withRouter} from 'react-router-dom';
import {
    ptGetClientProgression,
    clearProgression,
    getCurrentClient,
    clearCurrentClient,
    getClientProfileNotes,
    clearClientProfileNotes,
    ptGetClientBodyBio,
    clearBodyBio
} from "../../../actions/ptProfileActions";
import {
    getClientData,
    getClientProgression,
    getProfileNotes,
    clearProfileNotes,
    getBodyBioClient,
    clearBodyBioClient
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
            clientData: undefined,
            loaded: false,
            errors: {},
        };

        this.getClientProgression = this.getClientProgression.bind(this);
        this.getBodyBioClient = this.getBodyBioClient.bind(this);
    }

    static getDerivedStateFromProps(props, state){
        if(props.authenticatedUser.user.pt){
            if(props.ptProfile.current_client !== state.clientData){
                return {
                    clientData: props.ptProfile.current_client
                }
            }
            if(props.ptProfile.client_progression !== state.client_progression){
                return {
                    client_progression: props.ptProfile.client_progression,
                    loaded: true,
                }
            }
            if(props.ptProfile.body_bio !== state.body_bio){
                return {
                    body_bio: props.ptProfile.body_bio,
                    loaded: true,
                }
            }
            return null;
        }
        else {
            if(props.clientProfile.client_data !== state.clientData) {
                return {
                    clientData: props.clientProfile.client_data
                }
            }
            if(props.clientProfile.client_progression !== state.client_progression){
                return {
                    client_progression: props.clientProfile.client_progression,
                    loaded: true,
                }
            }
            if(props.clientProfile.body_bio !== state.body_bio){
                return {
                    body_bio: props.clientProfile.body_bio,
                    loaded: true,
                }
            }
            return null;
        }
    }

    componentDidMount() {
        const {isAuthenticated} = this.props.authenticatedUser;
        if(!isAuthenticated)
            this.props.history.push('/login');
        checkExp();
        if(this.props.authenticatedUser.user.pt){
            this.props.getCurrentClient(this.state.clientId, this.props.history);
            this.props.getClientProfileNotes(this.state.clientId, this.props.history);
            this.props.ptGetClientBodyBio(this.state.clientId, this.props.history);
        }
        else{
            this.props.getProfileNotes(this.state.clientId, this.state.history);
            this.props.getBodyBioClient(this.state.clientId, this.props.history);
        }
        this.getClientProgression();
    } // did mount

    componentWillUnmount(){
        const {isAuthenticated} = this.props.authenticatedUser;
        if(!isAuthenticated){
            this.props.history.push('/re-login');
        }
        // This got rid of the Date: null bug for now, need to find route cause!!!
        if(this.props.authenticatedUser.user.pt){
            this.props.clearCurrentClient();
            this.props.clearClientProfileNotes();
            this.props.clearBodyBio();
        }
        this.props.clearProgression();
        this.props.clearBodyBioClient();
        this.setState({loaded: false})
    }

    getClientProgression(){
        if(this.props.authenticatedUser.user.pt){
            this.props.ptGetClientProgression(this.state.clientId, this.props.history);
        }
        else{
            this.props.getClientProgression(this.state.clientId, this.props.history);
        }
    }

    getBodyBioClient(){
        if(this.props.authenticatedUser.user.pt){
            this.props.ptGetClientBodyBio(this.state.clientId, this.props.history);
        }
        else{
            this.props.getBodyBioClient(this.state.clientId, this.props.history);
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
    clientProfile: PropTypes.object.isRequired,
    getClientData: PropTypes.func.isRequired,
    getClientProfileNotes: PropTypes.func.isRequired,
    getProfileNotes: PropTypes.func.isRequired,
    ptProfile: PropTypes.object.isRequired,
    getCurrentClient: PropTypes.func.isRequired,
    getClientProgression: PropTypes.func.isRequired,
    ptGetClientProgression: PropTypes.func.isRequired,
    getBodyBioClient: PropTypes.func.isRequired,
    ptGetClientBodyBio: PropTypes.func.isRequired,
    clearProgression: PropTypes.func.isRequired,
    clearCurrentClient: PropTypes.func.isRequired,
    clearClientProfileNotes: PropTypes.func.isRequired,
    clearProfileNotes: PropTypes.func.isRequired,
    clearBodyBio: PropTypes.func.isRequired,
    clearBodyBioClient: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
};

// Used to pull auth state and errors into this component
const stateToProps = (state) => {
    return {
        authenticatedUser: state.authenticatedUser,
        clientProfile: state.clientProfile,
        ptProfile: state.ptProfile,
        errors: state.errors
}};

export default connect(stateToProps, {getClientProgression, ptGetClientProgression, clearProgression, getCurrentClient, getClientData, clearCurrentClient, getClientProfileNotes,clearClientProfileNotes, getProfileNotes, clearProfileNotes, getBodyBioClient, ptGetClientBodyBio, clearBodyBio, clearBodyBioClient})(withRouter(ClientProfile));
