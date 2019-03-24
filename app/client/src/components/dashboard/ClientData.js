import {connect} from 'react-redux';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {saveClientId} from "../../actions/authenticationActions";
// import PropTypes from "prop-types";


class ClientData extends Component {
    // This allows the component states to be up{dated and re-rendered)
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.authenticatedUser.user.id,
            errors: {}
        }
    }

    onProfileClick(id){
        this.props.saveClientId(id, this.props.history);
        this.props.history.push(`/users/${id}/client_profile/${id}`);
    }

    onScheduleClick(id) {
        window.location.href = `/users/${id}/scheduler/${id}`;
    };

    onEditProfile(id) {
        this.props.saveClientId(id, this.props.history);
        this.props.history.push(`/users/${id}/edit_client`);
    };

    render() {

        return (
            <div className="row">
                <div className="m-auto col-md-10">
                    <h1 className=" text-center display-5">Dashboard</h1>
                    <div>
                        <div>
                            <h3 className="mt-5 mb-4">{this.props.authenticatedUser.user.name}</h3>
                            <table className="table client-table">
                                <thead>
                                <tr>
                                    <th align="center">Profile</th>
                                    <th align="center">workout Schedule</th>
                                    <th align="center">Edit details</th>
                                </tr>
                                <tr>
                                    <td align="center"><a onClick={this.onProfileClick.bind(this, this.state.id)}>
                                        <i className="fas fa-columns fa-2x"></i></a>
                                    </td>
                                    <td align="center"><a onClick={this.onScheduleClick.bind(this, this.state.id)}><i
                                        className="far fa-calendar-alt fa-2x"></i></a>
                                    </td>
                                <td align="center"><a onClick={this.onEditProfile.bind(this, this.state.id)}><i
                                    className="fas fa-edit fa-2x"></i></a>
                                </td>
                                </tr>
                                </thead>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ClientData.propTypes = {
    // deleteClient: PropTypes.func.isRequired
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors
});

export default connect(stateToProps, {saveClientId})(withRouter(ClientData));
