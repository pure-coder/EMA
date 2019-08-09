import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {withRouter} from 'react-router-dom';
import {ptGetClientProgression, clearProgression, getCurrentClient, clearCurrentClient, getClientProfileNotes, clearClientProfileNotes} from "../../../actions/ptProfileActions";
import {getClientData, getClientProgression, getProfileNotes, clearProfileNotes} from "../../../actions/clientProfileActions";
import Graphs from "../progression/Graphs";
// import NewClientProgressForm from "../progression/NewClientProgressForm";
// import Modal from 'react-awesome-modal';
import isEmpty from '../../../utilities/is_empty';
import ErrorComponent from "../../error/ErrorComponent";
import Loading from "../../../elements/Loading";
import UserInfo from "../UserInfo";
import ProfileNotes from "../profileNotes/ProfileNotes";

// import FormInputGroup from "../common/FormInputGroup"; // Allows proper routing and linking using browsers match, location, and history properties

class ClientProfile extends Component {
    // This allows the component states to be up{dated and re-rendered
    constructor(props) {
        super(props);
        this.state = {
            client_progression: props.authenticatedUser.user.pt ? props.ptProfile.client_progression :
                props.clientProfile.client_progression,
            userId: props.authenticatedUser.user.id,
            clientId: props.authenticatedUser.user.pt ? props.match.params.cid : props.authenticatedUser.user.id,
            clientData: undefined,
            loaded: false,
            errors: {},
        };

        this.getClientProgression = this.getClientProgression.bind(this);
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
            return null;
        }
    }

    componentDidMount() {
        if(this.props.authenticatedUser.user.pt){
            this.props.getCurrentClient(this.state.clientId, this.props.history);
            this.props.getClientProfileNotes(this.state.clientId, this.props.history)
        }
        else{
            this.props.getProfileNotes(this.state.clientId, this.state.history)
        }
        this.getClientProgression();
    } // did mount

    componentWillUnmount(){
        // This got rid of the Date: null bug for now, need to find route cause!!!
        if(this.props.authenticatedUser.user.pt){
            this.props.clearCurrentClient();
            this.props.clearClientProfileNotes();
        }
        this.props.clearProgression();
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

    render() {
        const {user} = this.props.authenticatedUser;
        const client_data = this.state.clientData;
        const clientProgressData = this.state.client_progression;

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
                        <div className="col">
                            <Graphs graphData={clientProgressData}/>
                        </div>
                        <div className="col">
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
    clearProgression: PropTypes.func.isRequired,
    clearCurrentClient: PropTypes.func.isRequired,
    clearClientProfileNotes: PropTypes.func.isRequired,
    clearProfileNotes: PropTypes.func.isRequired,
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

export default connect(stateToProps, {getClientProgression, ptGetClientProgression, clearProgression, getCurrentClient, getClientData, clearCurrentClient, getClientProfileNotes,clearClientProfileNotes, getProfileNotes, clearProfileNotes})(withRouter(ClientProfile));
