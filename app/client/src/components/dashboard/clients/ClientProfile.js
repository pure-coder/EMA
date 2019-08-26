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
            client_data: null,
            profile_notes: null,
            body_bio: null,
            client_progression: null
        };
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
            this.props.clientGetData();
            this.props.clientGetBodyBio();
            this.props.clientGetProgression();
            this.props.clientGetProfileNotes();
        }

    } // did mount

    componentDidUpdate(){
        if(this.props.authenticatedUser.user.pt){
            if(this.state.client_data === null && this.props.ptProfile.current_client !== null){
                this.setState({
                    client_data: this.props.ptProfile.current_client,

                });
            }
        }
        else {
            if((this.state.client_data === null && this.props.clientProfile.client_data !== null) &&
                (this.state.profile_notes === null && this.props.clientProfile.profile_notes !== null) &&
                (this.state.body_bio === null && this.props.clientProfile.body_bio !== null) &&
                (this.state.client_progression === null && this.props.clientProfile.client_progression !== null)
            ){
                this.setState({
                    client_data: this.props.clientProfile.client_data,
                    profile_notes: this.props.clientProfile.profile_notes,
                    body_bio: this.props.clientProfile.body_bio,
                    client_progression: this.props.clientProfile.client_progression
                });
            }
        }
    }

    componentWillUnmount(){
        // This got rid of the Date: null bug for now, need to find route cause!!!
        if(this.props.authenticatedUser.user.pt){
            this.props.ptClearCurrentClientProfile();
            this.props.ptClearClientProgression();
            this.props.ptClearClientBodyBio();
            this.props.ptClearClientProfileNotes();
        }
        else{
            this.props.clientClearProfile();
            this.props.clientClearBodyBio();
            this.props.clientClearProfileNotes();
            this.props.clientClearProgression();
        }
    }

    render() {
        const {user, isAuthenticated} = this.props.authenticatedUser;
        const {client_data, profile_notes, body_bio, client_progression} = this.state;
        console.log(client_data, profile_notes, body_bio, client_progression)

        if(user.pt){
            if (client_data === null ||
                client_data.body_bio === null ||
                client_data.client_progression === null ||
                client_data.profile_notes === null ||
                client_data.ptLoading) {
                return <Loading myClassName="loading_container"/>
            }
        }
        else {
            if (client_data === null ||
                client_data.body_bio === null ||
                client_data.client_progression === null ||
                client_data.profile_notes === null ||
                client_data.clientLoading) {
                return <Loading myClassName="loading_container"/>
            }
        }
        if(!isAuthenticated){
            return <ErrorComponent/>
        }
        else{
            return (
                <div className="client-profile">
                    <h1 className=" text-center display-5 mb-3">Client Profile</h1>
                    <UserInfo userData={user.pt ? client_data
                        : client_data}/>
                    <div className="row">
                        <div className="col-sm Profile_margin">
                            <BodyGraphs bodyGraphData={client_data.body_bio}/>
                            <Graphs graphData={client_data.client_progression}/>
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
