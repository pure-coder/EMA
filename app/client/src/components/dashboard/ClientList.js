import {connect} from 'react-redux';
import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {deleteClient, saveClientId, getClientData, getClientProgression} from "../../actions/authenticationActions";
import PropTypes from "prop-types";
import isEmpty from "../../utilities/is_empty";
import ErrorComponent from "../error/ErrorComponent";
import Loading from "../../elements/Loading";


class ClientList extends Component {
    // This allows the component states to be up{dated and re-rendered)
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            errors: {}
        }
    }

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

    componentDidUpdate(){
    }

    onClientDelete(id, ptId) {
        this.props.deleteClient(id, ptId, this.props.history);
    };

    onProfileClick(ptId, id){
        this.props.saveClientId(id, this.props.history);
        this.props.history.push(`/users/${ptId}/client_profile/${id}`);
    }

    // Tried to use Link component but it didn't call the url directly like window.location.href so the scheduler data
    // for clients was not loaded or saved correctly
    onScheduleClick(ptId, id) {
        window.location.href = `/users/${ptId}/scheduler/${id}`;
    };

    onEditProfile(id) {
        // Get client data for link clicked and save it to redux store
        this.props.getClientData(id, this.props.history);
        // Save clientId to redux
        this.props.saveClientId(id, this.props.history);
        // Direct user with history push to edit profile of user id
        this.props.history.push(`/users/${id}/edit_client`);
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
        if(!this.state.loaded){
            return <Loading/>;
        }
        if(isEmpty(this.props.authenticatedUser.user)){
            return <ErrorComponent/>
        }
        else{
            // check clients are set properly
            // console.log(this.props.clients)

            // Use sortedMap function to sort the client names and then send to view
            const clients = this.sortedMap(this.props.clients).map(client => (
                <tr key={client._id}>
                    <td align="center"><b>{client.FullName}</b></td>
                    <td align="center"><a onClick={this.onProfileClick.bind(this, client.ptId, client._id)}>
                        <i className="fas fa-columns fa-2x"></i></a>
                    </td>
                    <td align="center">
                        <a onClick={this.onScheduleClick.bind(this, client.ptId, client._id)}><i
                            className="far fa-calendar-alt fa-2x"></i></a>
                    </td>
                    <td align="center">
                        <a onClick={this.onEditProfile.bind(this, client._id)}><i
                            className="fas fa-edit fa-2x"></i></a>
                    </td>
                    <td align="center">
                        <button
                            onClick={this.onClientDelete.bind(this, client._id, client.ptId)}
                            className="btn btn-danger">
                            Delete
                        </button>
                    </td>
                </tr>
            ));
            return (
                <div className="row">
                    <div className="m-auto col-md-10">
                        <h1 className=" text-center display-5">Dashboard</h1>
                        <div className="pt-buttons mt-5">
                            <Link to={'/users/' + this.props.authenticatedUser.user.id + '/register_client'}>
                                <button
                                    className="btn btn-primary dashboard-new-client">
                                    Add new Client
                                </button>
                            </Link>
                            <Link to={'/users/' + this.props.authenticatedUser.user.id + '/edit_personal_trainer'}>
                                <button
                                    className="btn btn-success dashboard-edit-own-profile">
                                    Edit own profile
                                </button>
                            </Link>
                        </div>
                        <div>
                            <div>
                                <h3 className="mt-5 mb-3">Clients</h3>
                                <table className="table client-table">
                                    <thead>
                                    <tr>
                                        <th align="center">Name</th>
                                        <th align="center">Profile</th>
                                        <th align="center">workout Schedule</th>
                                        <th align="center">Edit details</th>
                                        <th align="center">Delete User</th>
                                    </tr>
                                    {clients}
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

    }
}

ClientList.propTypes = {
    deleteClient: PropTypes.func.isRequired,
    getClientData: PropTypes.func.isRequired,
    getClientProgression: PropTypes.func.isRequired,
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors
});

export default connect(stateToProps, {deleteClient, saveClientId, getClientData, getClientProgression})(withRouter(ClientList));
