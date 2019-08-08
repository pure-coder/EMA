import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {withRouter} from 'react-router-dom';
import {ptGetClientProgression, clearProgression, getCurrentClient, clearCurrentClient, getClientProfileNotes, clearClientProfileNotes} from "../../../actions/ptProfileActions";
import {getClientData, getClientProgression} from "../../../actions/clientProfileActions";
import Graphs from "../progression/Graphs";
import NewClientProgressForm from "../progression/NewClientProgressForm";
import Modal from 'react-awesome-modal';
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
            client_progression: props.authenticatedUser.user.pt ? props.ptProfile.client_progression : props.clientProfile.client_progression,
            userId: props.authenticatedUser.user.id,
            clientId: props.authenticatedUser.user.pt ? props.match.params.cid : props.authenticatedUser.user.id,
            clientData: undefined,
            loaded: false,
            modalWidth: "500",
            modalHeight: "500",
            visible: false, // For modal
            errors: {},
            something: null
        };

        this.modalSize = this.modalSize.bind(this);
        this.openModal = this.openModal.bind(this);
        this.getClientProgression = this.getClientProgression.bind(this);
        this.onClickAway = this.onClickAway.bind(this)
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
            this.props.getClientProfileNotes(this.state.userId, this.state.clientId, this.props.history)
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

    modalSize(height){
        this.setState({modalHeight: height});
    }

    openModal() {
        this.setState({
            visible : true
        });
    }

    onClickAway() {
        this.setState({
            visible: false
        });
        this.getClientProgression();
    }

    getClientProgression(){
        if(this.props.authenticatedUser.user.pt){
            this.props.ptGetClientProgression(this.state.userId, this.state.clientId, this.props.history);
        }
        else{
            this.props.getClientProgression(this.state.userId, this.state.clientId, this.props.history);
        }

    }

    render() {
        const {user} = this.props.authenticatedUser;
        const client_data = this.state.clientData;
        const profile_notes = this.props.ptProfile.profile_notes;

        if(client_data === null || client_data === undefined || profile_notes === null){
            return <Loading myClassName="loading_container"/>
        }
        if(isEmpty(user)){
            return <ErrorComponent/>
        }
        else{
            let displayContent;
            let clientProgressData = this.state.client_progression;

            // If client has no data then display appropriate message, otherwise
            if (isEmpty(clientProgressData)) {
                displayContent = (
                    <h2 className="text-center text-info mt-5">No client progression data...</h2>
                )
            }
            else{
                displayContent = (
                    <Graphs graphData={clientProgressData}/>
                )
            }

            return (
                <div className="client-profile">
                    <h1 className=" text-center display-5 mb-3">Client Profile</h1>
                        <UserInfo userData={this.state.clientData}/> {/* Use data from props.location.state*/}
                        <div className="m-auto col-md-10">
                            <div className="m-auto col-10 graphs" id="graphs">
                                <div className="Progression Progression_head">
                                    <div className="Progression">
                                        <h2 className=" text-center display-5 mt-3 mb-4">Client progression data</h2>
                                        <h6 className=" text-center display-5 mt-3 mb-4">(Showing exercise data that have 2+ data entries)</h6>
                                        {/*Only display Add progress if user is a pt*/}
                                        {this.props.authenticatedUser.user.pt === true ?
                                                <input id="progress-button" type="button" className="btn btn-success btn-block mt-4 mb-5" value="Add Exercise Progression Data"
                                                       onClick={this.openModal} />
                                             : null
                                        }

                                    </div>
                                    {/*Display the clients progression data*/}
                                    {displayContent}
                                </div>
                            </div>
                            <ProfileNotes data={profile_notes}/>
                        </div>



                    <Modal visible={this.state.visible} width={this.state.modalWidth} height={this.state.modalHeight} effect="fadeInUp"
                           onClickAway={this.onClickAway}>
                        <div>
                            {/*Sending onClickAway into child component NewClientProgress allows the child to affect this parents state!!!
                         Also sending modal visibility so fields and errors can be cleared when visibility is false.
                         Also sending getClientProgression so that the page can be updated once a new progress submission
                           has been successful.*/}
                            <NewClientProgressForm onClickAway={this.onClickAway}
                                                   visible={this.state.visible}
                                                    modalSize={this.modalSize}
                                                   progressFormHeight={this.state.modalHeight}
                            />
                        </div>
                    </Modal>
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
    ptProfile: PropTypes.object.isRequired,
    getCurrentClient: PropTypes.func.isRequired,
    getClientProgression: PropTypes.func.isRequired,
    ptGetClientProgression: PropTypes.func.isRequired,
    clearProgression: PropTypes.func.isRequired,
    clearCurrentClient: PropTypes.func.isRequired,
    clearClientProfileNotes: PropTypes.func.isRequired,
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

export default connect(stateToProps, {getClientProgression, ptGetClientProgression, clearProgression, getCurrentClient, getClientData, clearCurrentClient, getClientProfileNotes
,clearClientProfileNotes})(withRouter(ClientProfile));
