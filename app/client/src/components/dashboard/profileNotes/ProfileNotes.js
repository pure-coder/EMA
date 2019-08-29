import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import {
    ptClearClientProfileNotes,
    ptUpdateClientProfileNotes,
    clearErrors, clearSuccess
} from "../../../actions/ptProfileActions";
import {
    clientClearProfileNotes
} from "../../../actions/clientProfileActions";
import isEmpty from "../../../validation/is_empty";
import ProfileInputForm from "../../common/Forms/ProfileInputForm";

class ProfileNotes extends Component {
    constructor(props){
        super(props);
        let {data} = props;
        this.state = {
            clientId: this.props.authenticatedUser.user.pt ? this.props.ptProfile.current_client._id :
                this.props.clientProfile.client_data._id,
            goals: data.goals,
            injuries: data.injuries,
            notes: data.notes,
            rows: '6',
            cols: '36',
            readonly: this.props.authenticatedUser.user.pt,
            errors: {},
            success: {},
            fieldUpdated: '',
            updated: false
        };
    }

    static getDerivedStateFromProps(prevProps, state){
        if(prevProps.success !== state.success){
            return {
                success: prevProps.success
            }
        }
        if(prevProps.errors !== state.errors){
            return {
                errors: prevProps.errors
            }
        }
        return null
    }

    componentWillUnmount(){
        if(this.props.authenticatedUser.user.pt){
            this.props.ptClearClientProfileNotes();
            this.props.clearErrors();
            this.props.clearSuccess();
        }
        else{
            this.props.clientClearProfileNotes();
        }
    }

    onChange = e => {
        e.preventDefault();
        let name = e.target.name;
        let value = e.target.value;
        this.setState({[name]: value});

        if(!isEmpty(this.props.errors)){
            this.props.clearErrors();
        }
        if(!isEmpty(this.props.success)){
            this.props.clearSuccess();
        }
    };

    onSubmit = e => {
        e.preventDefault();
        let name = e.target.name;

        const data = {
            [name]: this.state[name]
        };

        // make sure user is a pt
        if(this.props.authenticatedUser.user.pt){
            this.props.ptUpdateClientProfileNotes(this.state.clientId, data, this.props.history);
            this.setState({fieldUpdated: name});
        }
    };

    render() {
        return (
            <div className="Profile_notes card">
                <div className="mt-2 mb-5">
                    <ProfileInputForm
                        onSubmit={this.onSubmit}
                        ptCheck={this.props.authenticatedUser.user.pt}
                        label="Goals:"
                        name="goals"
                        value={this.state.goals}
                        onChange={this.onChange}
                        fieldUpdated={this.state.fieldUpdated}
                        cols={this.state.cols}
                        rows={this.state.rows}
                        success={this.state.success}
                        errors={this.state.errors}
                    />
                </div>
                <div className="mt-2 mb-5">
                    <ProfileInputForm
                        onSubmit={this.onSubmit}
                        ptCheck={this.props.authenticatedUser.user.pt}
                        label="Injuries/Limitations:"
                        name="injuries"
                        value={this.state.injuries}
                        onChange={this.onChange}
                        fieldUpdated={this.state.fieldUpdated}
                        cols={this.state.cols}
                        rows={this.state.rows}
                        success={this.state.success}
                        errors={this.state.errors}
                    />
                </div>
                <div className="mt-2 mb-5">
                    <ProfileInputForm
                        onSubmit={this.onSubmit}
                        ptCheck={this.props.authenticatedUser.user.pt}
                        label="Notes:"
                        name="notes"
                        value={this.state.notes}
                        onChange={this.onChange}
                        fieldUpdated={this.state.fieldUpdated}
                        cols={this.state.cols}
                        rows={this.state.rows}
                        success={this.state.success}
                        errors={this.state.errors}
                    />
                </div>
            </div>
        )
    }
}

ProfileNotes.propTypes = {
    authenticatedUser: PropTypes.object.isRequired,
    ptProfile: PropTypes.object.isRequired,
    clientProfile: PropTypes.object.isRequired,
    ptClearClientProfileNotes: PropTypes.func.isRequired,
    clientClearProfileNotes: PropTypes.func.isRequired,
    ptUpdateClientProfileNotes: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    ptProfile: state.ptProfile,
    clientProfile: state.clientProfile,
    errors: state.errors,
    success: state.success
});

export default connect(stateToProps, {
    ptClearClientProfileNotes,
    clientClearProfileNotes,
    ptUpdateClientProfileNotes,
    clearErrors, clearSuccess
})(ProfileNotes);
