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
            clientId: props.authenticatedUser.user.pt ? props.match.params.cid : props.match.params.uid,
            clientData: props.clientProfile.client_data,
        };
        console.log(props)
    }


    componentDidMount() {
        const {isAuthenticated} = this.props.authenticatedUser;
        if(!isAuthenticated)
            this.props.history.push('/login');
        checkExp();
    } // did mount

    componentWillUnmount(){
        // This got rid of the Date: null bug for now, need to find route cause!!!
        // if(this.props.authenticatedUser.user.pt){
        //     this.props.ptClearCurrentClientProfile(this.state.clientId, this.props.history);
        //     this.props.ptClearClientProgression(this.state.clientId, this.props.history);
        //     this.props.ptClearClientBodyBio(this.state.clientId, this.props.history);
        //     this.props.ptClearClientProfileNotes(this.state.clientId, this.props.history);
        // }
        // else{
        //     this.props.clientClearProfile(this.state.clientId, this.props.history);
        //     this.props.clientClearBodyBio(this.state.clientId, this.props.history);
        //     this.props.clientClearProfileNotes(this.state.clientId, this.props.history);
        //     this.props.clientClearProgression(this.state.clientId, this.props.history);
        // }
    }

    render() {
        const {user, isAuthenticated} = this.props.authenticatedUser;
        const {client_data, body_bio, client_progression, profile_notes, clientLoading} = this.props.clientProfile;
        // let profile_notes;
        //
        // if(user.pt){
        //     profile_notes = this.props.ptProfile.profile_notes;
        // }
        // else{
        //     profile_notes = this.props.clientProfile.profile_notes;
        // }

        if( client_data === null ||
            body_bio === null ||
            client_progression === null ||
            profile_notes === null ||
            clientLoading){
            return <Loading myClassName="loading_container"/>
        }
        if(!isAuthenticated){
            return <ErrorComponent/>
        }
        else{
            return (
                <div className="client-profile">
                    <h1 className=" text-center display-5 mb-3">Client Profile</h1>
                    <UserInfo userData={client_data}/> {/* Use data from props.location.state*/}
                    <div className="row">
                        <div className="col-sm Profile_margin">
                            <BodyGraphs bodyGraphData={body_bio}/>
                            <Graphs graphData={client_progression}/>
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

    // PT data
    ptGetClients: PropTypes.func.isRequired,
    ptGetData: PropTypes.func.isRequired,

    // Client data
    clientGetData: PropTypes.func.isRequired,

    clearSuccess: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
};

// Used to pull auth state and errors into this component
const stateToProps = (state) => ({
        authenticatedUser: state.authenticatedUser,
        clientProfile: state.clientProfile,
        ptProfile: state.ptProfile,
        errors: state.errors
});

export default connect(stateToProps, {
    ptGetCurrentClient,
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
    clientClearProfileNotes,
})(withRouter(ClientProfile));
