import {connect} from 'react-redux';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import ErrorComponent from "../../error/ErrorComponent";
import Loading from "../../common/Loading";
import Link from "react-router-dom/es/Link";
// import PropTypes from "prop-types";


class ClientData extends Component {
    // This allows the component states to be up{dated and re-rendered)
    constructor(props) {
        super(props);
        this.state = {
            id: props.authenticatedUser.user.id,
            authenticatedUser: props.authenticatedUser,
            errors: {},
            loaded: false
        }
    }

    componentDidMount(){
        document.body.scrollTo(0,0);
    }

    render() {

        const {user, isAuthenticated} = this.props.authenticatedUser;
        const {clientData} = this.props;

        if(!isAuthenticated){
            return <ErrorComponent/>
        }
        if(clientData === null){
            return <Loading/>;
        }
        else {
            return (
                <div className="row">
                    <div className="m-auto col-md-10">
                        <h3 className="mt-5 mb-3">Client Links</h3>
                        <table className="table client-table">
                            <thead>
                            <tr className="even-row">
                                <th align="center">Profile</th>
                                <th align="center">workout Schedule</th>
                                <th align="center">Edit details</th>
                            </tr>
                            <tr>
                                <td align="center">
                                    <Link to={{pathname: `/users/${user.id}/client_profile`}}>
                                        <i className="fas fa-columns fa-2x"></i>
                                    </Link>
                                </td>
                                <td align="center">
                                    <Link
                                        to={{pathname: `/users/${user.id}/scheduler`}}>
                                        <i className="far fa-calendar-alt fa-2x"></i>
                                    </Link>
                                </td>
                                <td align="center">
                                    <Link to={{pathname: `/users/${user.id}/edit_client`}}>
                                        <i className="fas fa-edit fa-2x"></i>
                                </Link>
                                </td>
                            </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            );
        }
    }
}

ClientData.propTypes = {
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    clientProfile: state.clientProfile,
    errors: state.errors
});

export default connect(stateToProps, {})(withRouter(ClientData));
