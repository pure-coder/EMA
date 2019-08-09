import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import {clearClientProfileNotes, updateClientProfileNotes, clearErrors, clearSuccess} from "../../../actions/ptProfileActions";
import {clearProfileNotes} from "../../../actions/clientProfileActions";
import isEmpty from "../../../validation/is_empty";

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
            <div className="Profile_notes">
                <div className="mt-2 mb-5">
                    <form className="form-group" name="goals" onSubmit={this.onSubmit}>
                        <label className="control-label form-control-lg label-profile">
                            Goals:
                        </label>
                        {/*// Indicated successfull update*/}
                        {!isEmpty(this.state.success) && this.state.fieldUpdated === 'goals'
                        && <p className="text-success profile-success">{this.state.success.msg}</p>}
                        {/*// Indicated unsuccessfull update*/}
                        {!isEmpty(this.state.errors) && this.state.fieldUpdated === 'goals'
                        && <p className="text-danger profile-error">{this.state.errors.msg}</p>}
                        <textarea
                            readOnly={!this.props.authenticatedUser.user.pt}
                            name="goals"
                            value={this.state.goals}
                            onChange={this.onChange}
                            className="form-control form-control-lg"
                            rows={this.state.rows} cols={this.state.cols}>
                        </textarea>
                        {this.props.authenticatedUser.user.pt ?
                            <input type="submit" value="Update" className="btn btn-info btn-block mt-1 profile_notes"/> :
                            null
                        }
                    </form>
                </div>
                <div className="mt-2 mb-5">
                    <form className="form-group" name="injuries" onSubmit={this.onSubmit}>
                        <label className="control-label form-control-lg label-profile">
                            Injuries/Limitations:
                        </label>
                        {/*// Indicated successfull update*/}
                        {!isEmpty(this.state.success) && this.state.fieldUpdated === 'injuries'
                        && <p className="text-success profile-success">{this.state.success.msg}</p>}
                        {/*// Indicated unsuccessfull update*/}
                        {!isEmpty(this.state.errors) && this.state.fieldUpdated === 'injuries'
                        && <p className="text-danger profile-error">{this.state.errors.msg}</p>}
                        <textarea
                            readOnly={!this.props.authenticatedUser.user.pt}
                            name="injuries"
                            value={this.state.injuries}
                            onChange={this.onChange}
                            className="form-control form-control-lg"
                            rows={this.state.rows} cols={this.state.cols}>
                        </textarea>
                        {this.props.authenticatedUser.user.pt ?
                            <input type="submit" value="Update" className="btn btn-info btn-block mt-1 profile_notes"/> :
                            null
                        }
                    </form>
                </div>
                <div className="mt-2 mb-5">
                    <form className="form-group" name="notes" onSubmit={this.onSubmit}>
                        {/*// Indicated successfull update*/}
                        <label className="control-label form-control-lg label-profile">
                            Notes:
                        </label>
                        {/*// Indicated successfull update*/}
                        {!isEmpty(this.state.success) && this.state.fieldUpdated === 'notes'
                        && <p className="text-success profile-success">{this.state.success.msg}</p>}
                        {/*// Indicated unsuccessfull update*/}
                        {!isEmpty(this.state.errors) && this.state.fieldUpdated === 'notes'
                        && <p className="text-danger profile-error">{this.state.errors.msg}</p>}
                        <textarea
                            readOnly={!this.props.authenticatedUser.user.pt}
                            name="notes"
                            value={this.state.notes}
                            onChange={this.onChange}
                            className="form-control form-control-lg"
                            rows={this.state.rows} cols={this.state.cols}>
                        </textarea>
                        {this.props.authenticatedUser.user.pt ?
                            <input type="submit" value="Update" className="btn btn-info btn-block mt-1 profile_notes"/> :
                            null
                        }
                    </form>
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
