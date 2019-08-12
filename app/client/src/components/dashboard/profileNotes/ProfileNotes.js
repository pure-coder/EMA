import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import {clearClientProfileNotes, updateClientProfileNotes, clearErrors, clearSuccess} from "../../../actions/ptProfileActions";
import {clearProfileNotes} from "../../../actions/clientProfileActions";
import isEmpty from "../../../validation/is_empty";
import ProfileInputForm from "../../common/ProfileInputForm";

class ProfileNotes extends Component {
    constructor(props){
        super(props);
        this.state = {
            clientId: this.props.authenticatedUser.user.pt ? this.props.ptProfile.current_client._id : this.props.clientProfile._id,
            profileData: this.props.data,
            goals: '',
            injuries: '',
            notes: '',
            rows: '6',
            cols: '36',
            readonly: this.props.authenticatedUser.user.pt,
            errors: {},
            success: {},
            fieldUpdated: '',
            updated: false
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    static getDerivedStateFromProps(prevProps, state){
        // Initiate state with data from database
        if(!state.updated){
            return {
                goals: prevProps.data.goals,
                injuries: prevProps.data.injuries,
                notes: prevProps.data.notes,
                updated: true
            }
        }
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
            this.props.clearClientProfileNotes();
            this.props.clearErrors();
            this.props.clearSuccess();
        }
        else{
            this.props.clearProfileNotes();
        }
    }

    onChange(e){
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
    }

    onSubmit(e){
        e.preventDefault();
        let name = e.target.name;

        const data = {
            [name]: this.state[name]
        };

        // make sure user is a pt
        if(this.props.authenticatedUser.user.pt){
            this.props.updateClientProfileNotes(this.state.clientId, data, this.props.history);
            this.setState({fieldUpdated: name});
        }
    }

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
    clearProfileNotes: PropTypes.func.isRequired,
    updateClientProfileNotes: PropTypes.func.isRequired,
    clearClientProfileNotes: PropTypes.func.isRequired,
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

export default connect(stateToProps, {clearClientProfileNotes, clearProfileNotes, updateClientProfileNotes, clearErrors, clearSuccess})(ProfileNotes);
