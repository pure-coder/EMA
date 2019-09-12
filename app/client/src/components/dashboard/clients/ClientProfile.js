import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {withRouter} from 'react-router-dom';
import {
    ptGetCurrentClient,
    ptGetClientProgression,
    ptGetClientBodyBio,
    ptGetClientProfileNotes,
} from "../../../redux/actions/ptProfileActions";
import {
    clientGetData,
    clientGetProgression,
    clientGetBodyBio,
    clientGetProfileNotes,
} from "../../../redux/actions/clientProfileActions";
import Graphs from "../progression/Graphs";
// import NewClientProgressForm from "../progression/NewClientProgressForm";
// import Modal from 'react-awesome-modal';
import ErrorComponent from "../../error/ErrorComponent";
import Loading from "../../common/Loading/Loading";
import UserInfo from "../../common/UserInfo/UserInfo";
import ProfileNotes from "../profileNotes/ProfileNotes";
import BodyGraphs from "../bodyBio/BodyGraphs";
import checkExp from "../../../utilities/checkExp";

// import FormInputGroup from "../common/FormInputGroup"; // Allows proper routing and linking using browsers match, location, and history properties

class ClientProfile extends Component {
    constructor(props){
        super(props);
        this.state = {
            client_data: null,
        };
    }

    static getDerivedStateFromProps(prevProps, prevState){
        if(prevProps.authenticatedUser.user.pt){
            if(prevProps.ptProfile !== prevState.clientData){
                return {
                    client_data: prevProps.ptProfile
                }
            }
        }
        else{
            if(prevProps.clientProfile !== prevState.clientData){
                return {
                    client_data: prevProps.clientProfile
                }
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
            this.props.clientGetData();
            this.props.clientGetBodyBio();
            this.props.clientGetProgression();
            this.props.clientGetProfileNotes();
        }

    } // did mount

    render() {
        const {user, isAuthenticated} = this.props.authenticatedUser;
        const {client_data} = this.state;

        if(user.pt){
            if (client_data === null ||
                client_data.body_bio === null ||
                client_data.client_progression === null ||
                client_data.profile_notes === null
            ) {
                return <Loading myClassName="loading_container"/>
            }
        }
        else {
            if (client_data === null ||
                client_data.body_bio === null ||
                client_data.client_progression === null ||
                client_data.profile_notes === null
            ){
                return <Loading myClassName="loading_container"/>
            }
        }
        if(!isAuthenticated){
            return <ErrorComponent/>
        }
        else{
            return (
                <div className="client-profile">
                    <div className=" client_profile_row row">
                        <UserInfo userData={user.pt ? client_data.current_client : client_data.client_data}/>
                    </div>
                    <div className="row pb-4">
                        <div className="col-sm Profile_margin">
                            <BodyGraphs bodyGraphData={client_data.body_bio}/>
                            <Graphs graphData={client_data.client_progression}/>
                        </div>
                        <div className="col-sm">
                            <ProfileNotes data={client_data.profile_notes}/>
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
    clientGetData,
    clientGetProgression,
    clientGetBodyBio,
    clientGetProfileNotes,
})(withRouter(ClientProfile));
