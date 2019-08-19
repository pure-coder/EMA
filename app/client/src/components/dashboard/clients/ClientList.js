import {connect} from 'react-redux';
import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {deleteClient, ptGetClientProgression} from "../../../actions/ptProfileActions";
import PropTypes from "prop-types";
import Modal from "react-awesome-modal";
import DeleteConfirm from './DeleteConfirm'
import isEmpty from "../../../utilities/is_empty";
import ErrorComponent from "../../error/ErrorComponent";
import Loading from "../../../elements/Loading";

class ClientList extends Component {
    // This allows the component states to be up{dated and re-rendered)
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            clientId: props.authenticatedUser.clientId || props.match.params.cid,
            deleteId: "",
            ptId: "",
            clientName: "",
            visible: false,
            modalHeight: "400",
            modalWidth: "500",
        };
    }

    openModal = (clientId, ptId, clientName) => {
        this.setState({
            visible : true,
            deleteId: clientId,
            ptId: ptId,
            clientName: clientName
        });
    };

    onClickAway = () => {
        this.setState({
            visible: false
        });
    };

    modalSize = height => {
        this.setState({modalHeight: height});
    };

    static getDerivedStateFromProps(nextProps, state){
        if(nextProps.errors !== state.errors){
            return {
                errors: nextProps.errors,
                loaded: true
            }
        }
        return null;
    }

    componentDidMount(){
        document.body.scrollTo(0,0);
    }

    onProfileClick(ptId, id, clientData){
        this.props.history.push({pathname: `/users/${ptId}/client_profile/${id}`, state :  {clientData: clientData} });
    }

    // Tried to use Link component but it didn't call the url directly like window.location.href so the scheduler data
    // for clients was not loaded or saved correctly
    static onScheduleClick(ptId, id) {
        this.props.history.push(`/users/${ptId}/scheduler/${id}`);
    };

    onEditProfile(userId, clientId) {
        // Direct user with history push to edit profile of user id
        this.props.history.push(`/users/${userId}/edit_client/${clientId}`);
    };

    sortedMap = (clients) => {
        return clients.sort((obj1, obj2) => {
            if (obj1.FullName < obj2.FullName) {
                return -1
            }
            if (obj1.FullName > obj2.FullName) {
                return 1
            }
            return 0;
        });
    }; // sortedMap


    render() {
        const {user} = this.props.authenticatedUser;
        const pt_data = this.props.userData;
        const clients = this.props.clients;

        if (pt_data === null) {
            return <Loading myClassName="loading_container"/>
        }
        if(isEmpty(user)){
            return <ErrorComponent/>
        }
        else{
            // check clients are set properly

            // Use sortedMap function to sort the client names and then send to view
            const ptClients = this.sortedMap(clients).map((client, index) => (
                <tr key={client._id} className={index % 2 === 0 ? "odd-row" : "even-row"}>
                    <td><b>{client.FullName}</b></td>
                    <td align="center"><a onClick={this.onProfileClick.bind(this, client.ptId, client._id, clients[index])}>
                        <i className="fas fa-columns fa-2x"></i></a>
                    </td>
                    <td align="center">
                        <a onClick={ClientList.onScheduleClick.bind(this, client.ptId, client._id)}><i
                            className="far fa-calendar-alt fa-2x"></i></a>
                    </td>
                    <td align="center">
                        <a onClick={this.onEditProfile.bind(this, user.id, client._id)}><i
                            className="fas fa-edit fa-2x"></i></a>
                    </td>
                    <td align="center">
                        <button
                            onClick={this.openModal.bind(this, client._id, client.ptId, client.FullName)}
                            className="btn btn-danger">
                            Delete
                        </button>
                    </td>
                </tr>
            ));
            return (
                <div className="row">
                    <div className="ClientList">
                        <div className="m-auto">
                            <div className="pt-buttons mt-5">
                                <Link to={`/users/${user.id}/register_client`}>
                                    <button
                                        className="btn btn-primary dashboard-new-client">
                                        Add new Client
                                    </button>
                                </Link>
                                <Link to={`/users/${user.id}/edit_personal_trainer`}>
                                    <button
                                        className="btn btn-success dashboard-edit-own-profile">
                                        Edit own profile
                                    </button>
                                </Link>
                            </div>
                                <h3 className="mt-5 mb-3">Clients</h3>
                                <table className="table client-table">
                                    <thead>
                                    <tr className="even-row">
                                        <th id="client-table-name">Name</th>
                                        <th align="center">Profile</th>
                                        <th align="center">Workout Schedule</th>
                                        <th align="center">Edit Details</th>
                                        <th align="center">Delete User</th>
                                    </tr>
                                    {ptClients}
                                    </thead>
                                </table>
                        </div>
                    </div>

                    <Modal visible={this.state.visible} width={this.state.modalWidth} height={this.state.modalHeight} effect="fadeInUp"
                           onClickAway={this.onClickAway}>

                        <DeleteConfirm name={this.state.clientName} clientId={this.state.deleteId} ptId={this.state.ptId} onClickAway={this.onClickAway}
                                       visible={this.state.visible}
                                       modalSize={this.modalSize}
                                       progressFormHeight={this.state.modalHeight}/>

                    </Modal>

                </div>
            );




        }

    }
}

ClientList.propTypes = {
    deleteClient: PropTypes.func.isRequired,
    ptGetClientProgression: PropTypes.func.isRequired,
    ptProfile: PropTypes.object.isRequired
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    ptProfile: state.ptProfile,
    errors: state.errors
});

export default connect(stateToProps, {deleteClient, ptGetClientProgression})(withRouter(ClientList));
