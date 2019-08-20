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
    constructor(props){
        super(props);
        this.state = {
            clientData: props.authenticatedUser.user.pt ? props.ptProfile.current_client : props.clientProfile,
        };
    }

    static getDerivedStateFromProps(prevProps, prevState){
        if(prevProps.clientProfile !== prevState.clientData){
            return {
                clientData: prevProps.clientProfile
            }
        }
        return null
    }

    componentDidMount() {
        const {isAuthenticated} = this.props.authenticatedUser;
        if(!isAuthenticated)
            this.props.history.push('/login');
        checkExp();
        if(this.props.authenticatedUser.user.pt){
            this.props.ptGetCurrentClient(this.props.match.params.cid);
            this.props.ptGetClientBodyBio(this.props.match.params.cid);
            this.props.ptGetClientProgression(this.props.match.params.cid);
            this.props.ptGetClientProfileNotes(this.props.match.params.cid);
        }
        else{
            this.props.clientGetData(this.props.authenticatedUser.user.id);
            this.props.clientGetBodyBio(this.props.authenticatedUser.user.id);
            this.props.clientGetProgression(this.props.authenticatedUser.user.id);
            this.props.clientGetProfileNotes(this.props.authenticatedUser.user.id);
        }

    } // did mount

    componentWillUnmount(){
        // This got rid of the Date: null bug for now, need to find route cause!!!
        if(this.props.authenticatedUser.user.pt){
            this.props.ptClearCurrentClientProfile(this.props.ptProfile.current_client._id, this.props.history);
            this.props.ptClearClientProgression(this.props.ptProfile.current_client._id, this.props.history);
            this.props.ptClearClientBodyBio(this.props.ptProfile.current_client._id, this.props.history);
            this.props.ptClearClientProfileNotes(this.props.ptProfile.current_client._id, this.props.history);
        }
        else{
            this.props.clientClearProfile(this.props.authenticatedUser.user.id, this.props.history);
            this.props.clientClearBodyBio(this.props.authenticatedUser.user.id, this.props.history);
            this.props.clientClearProfileNotes(this.props.authenticatedUser.user.id, this.props.history);
            this.props.clientClearProgression(this.props.authenticatedUser.user.id, this.props.history);
        }
    }

    render() {
        const {isAuthenticated} = this.props.authenticatedUser;
        const {clientData} = this.state;

        if( clientData.client_data === null ||
            clientData.body_bio === null ||
            clientData.client_progression === null ||
            clientData.profile_notes === null ||
            clientData.clientLoading){
            return <Loading myClassName="loading_container"/>
        }
        if(!isAuthenticated){
            return <ErrorComponent/>
        }
        else{
            return (
                <div className="client-profile">
                    <h1 className=" text-center display-5 mb-3">Client Profile</h1>
                    <UserInfo userData={clientData.client_data}/> {/* Use data from props.location.state*/}
                    <div className="row">
                        <div className="col-sm Profile_margin">
                            <BodyGraphs bodyGraphData={clientData.body_bio}/>
                            <Graphs graphData={clientData.client_progression}/>
                        </div>
                        <div className="col-sm">
                            <ProfileNotes data={clientData.profile_notes}/>
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
