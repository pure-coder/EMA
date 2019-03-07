import {connect} from 'react-redux';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {editProfile} from "../../actions/authenticationActions";
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

    onScheduleClick(id) {
        window.location.href = `/users/${id}/scheduler/${id}`;
    };

    onEditProfile(id) {
        this.props.editProfile(id, this.props.history);
    };

    render() {

        return (
            <div className="row">
                <div className="m-auto col-md-10">
                    <h1 className=" text-center display-5">Dashboard</h1>
                    <div>
                        <div>
                            <h3 className="mb-3">Client</h3>
                            <table className="table client-table">
                                <thead>
                                <tr>
                                    <td align="center"><a onClick={this.onScheduleClick.bind(this, this.state.id)}><i
                                        className="far fa-calendar-alt fa-2x"></i></a></td>
                                <td align="center"><a onClick={this.onEditProfile.bind(this, this.state.id)}><i
                                    className="fas fa-edit fa-2x"></i></a></td>
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

export default connect(stateToProps, {editProfile})(withRouter(ClientData));
