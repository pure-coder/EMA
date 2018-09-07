import { connect } from 'react-redux';
import React, { Component } from 'react';
import { deleteClient} from "../../actions/DashboardActions";
import PropTypes from "prop-types";


class ClientList extends Component {
    onClientDelete(id) {
        this.props.deleteClient(id);
    }
    onScheduleClick(ptId ,id) {
        window.location.href = '/users/' + ptId + '/scheduler/' + id;
    }

    render() {
        console.log(this.props.clients)
        let clients = this.props.clients.map(client => (
            <tr key={client.id}>
                <td> {client.FullName}</td>
                <td align="center"><i className="fas fa-columns fa-2x"></i></td>
                <td align="center"><a onClick={this.onScheduleClick.bind(this, client.ptId, client.id)}><i className="far fa-calendar-alt fa-2x"></i></a></td>
                <td align="center"><i className="fas fa-edit fa-2x"></i></td>
                <td align="center">
                    <button
                        onClick={this.onClientDelete.bind(this, client.id)}
                        className="btn btn-danger">
                        Delete
                    </button>
                </td>
            </tr>
        ))
        return (
            <div>
                <h3 className="mb-3">Clients</h3>
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
        );
    }
}

ClientList.propTypes = {
    deleteClient: PropTypes.func.isRequired
};

export default connect(null, { deleteClient})(ClientList);