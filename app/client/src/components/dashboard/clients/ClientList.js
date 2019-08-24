import {connect} from 'react-redux';
import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
// import {ptDeleteClient, ptGetClientProgression} from "../../../actions/ptProfileActions";
import PropTypes from "prop-types";
import Modal from "react-awesome-modal";
import DeleteConfirm from './DeleteConfirm'
import isEmpty from "../../../utilities/is_empty";
import ErrorComponent from "../../error/ErrorComponent";
import Loading from "../../../elements/Loading";

class ClientList extends Component {
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

    openModal = (cId, ptId, clientName) => {
        this.setState({
            visible: true,
            cid: cId,
            ptId: ptId,
            clientName: clientName
        })
    };

    clickAway = () => {
        this.setState({
            visible: false
        });
    };

    modalSize = height => {
        this.setState({modalHeight: height});
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
        const {ptData} = this.props;
        if (ptData.ptLoading) {
            return <Loading myClassName="loading_container"/>
        }
        if(isEmpty(user)){
            return <ErrorComponent/>
        }
        else{
            // check clients are set properly

            // Use sortedMap function to sort the client names and then send to view
            const ptClients = this.sortedMap(ptData.clients).map((client, index) => (
                <tr key={client._id} className={index % 2 === 0 ? "odd-row" : "even-row"}>
                    <td><b>{client.FullName}</b></td>
                    <td align="center">
                        <Link to={`/users/${ptData.pt_data._id}/client_profile/${client._id}`}>
                            <i className="fas fa-columns fa-2x"></i>
                        </Link>

                    </td>
                    <td align="center">
                        <Link to={`/users/${ptData.pt_data._id}/scheduler/${client._id}`}><i
                            className="far fa-calendar-alt fa-2x"></i>
                        </Link>
                    </td>
                    <td align="center">
                        <Link to={`/users/${ptData.pt_data._id}/edit_client/${client._id}`}><i
                            className="fas fa-edit fa-2x"></i>
                        </Link>
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

                    <Modal visible={this.state.visible}
                           width={this.state.modalWidth}
                           height={this.state.modalHeight}
                           effect="fadeInUp"
                           onClickAway={this.clickAway}
                    >
                        <DeleteConfirm name={this.state.clientName}
                                       clientId={this.state.deleteId}
                                       ptId={this.state.ptId}
                                       onClickAway={this.clickAway}
                                       visible={this.state.visible}
                                       modalSize={this.modalSize}
                                       progressFormHeight={this.state.modalHeight}
                        />
                    </Modal>

                </div>
            );
        }
    }
}

ClientList.propTypes = {
    // ptDeleteClient: PropTypes.func.isRequired,
    // ptGetClientProgression: PropTypes.func.isRequired,
    // ptProfile: PropTypes.object.isRequired
    ptData: PropTypes.object.isRequired,
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
});

export default connect(stateToProps, {})(withRouter(ClientList));
