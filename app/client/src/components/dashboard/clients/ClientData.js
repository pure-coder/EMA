import {connect} from 'react-redux';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import isEmpty from "../../../utilities/is_empty";
import ErrorComponent from "../../error/ErrorComponent";
import Loading from "../../../elements/Loading";
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

    static getDerivedStateFromProps(props, state){
        if(props.authenticatedUser !== state.authenticatedUser){
            return {
                authenticatedUser: props.authenticatedUser,
                loaded: true
            }
        }
        if(props.errors !== state.errors){
            return {
                errors: props.errors,
                loaded: true
            }
        }
        return null;
    }

    componentDidMount(){
        document.body.scrollTo(0,0);
    }

    onProfileClick(id){
        this.props.history.push(`/users/${id}/client_profile/${id}`);
    }

    static onScheduleClick(id) {
        this.props.history.push(`/users/${id}/scheduler/${id}`);
    };

    onEditProfile(id) {
        this.props.history.push(`/users/${id}/edit_client`);
    };

    render() {

        const {user} = this.props.authenticatedUser;
        const {loading} = this.props.clientProfile;

        if(loading){
            return <Loading/>;
        }
        if(isEmpty(user)){
            return <ErrorComponent/>
        }
        else {
            return (
                <div className="row">
                    <div className="m-auto col-md-10">
                        <h3 className="mt-5 mb-3">Client Links</h3>
                        <table className="table client-table">
                            <thead>
                            <tr>
                                <th align="center">Profile</th>
                                <th align="center">workout Schedule</th>
                                <th align="center">Edit details</th>
                            </tr>
                            <tr>
                                <td align="center"><a onClick={this.onProfileClick.bind(this, user.id)}>
                                    <i className="fas fa-columns fa-2x"></i></a>
                                </td>
                                <td align="center"><a
                                    onClick={ClientData.onScheduleClick.bind(this, user.id)}><i
                                    className="far fa-calendar-alt fa-2x"></i></a>
                                </td>
                                <td align="center"><a onClick={this.onEditProfile.bind(this, user.id)}><i
                                    className="fas fa-edit fa-2x"></i></a>
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
