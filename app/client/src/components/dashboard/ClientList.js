import { connect } from 'react-redux';
import React, { Component } from 'react';

class ClientList extends Component {

    render() {
        let clients = this.props.clients.map(client => (
            <tr>
                <td> {client.FullName}</td>
                <td align="center"><i className="fas fa-columns fa-2x"></i></td>
                <td align="center"><i className="far fa-calendar-alt fa-2x"></i></td>
                <td align="center"><i className="fas fa-edit fa-2x"></i></td>
                <td align="center">
                    <button
                        //onClick={this.onClientDelete.bind(this, client._id)}
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

export default connect(null, {})(ClientList);
