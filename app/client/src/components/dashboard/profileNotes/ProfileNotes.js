import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import {clearClientProfileNotes, updateClientProfileNotes} from "../../../actions/ptProfileActions";
import {clearProfileNotes} from "../../../actions/clientProfileActions";

class ProfileNotes extends Component {
    constructor(props){
        super(props);
        this.state = {
            clientId: this.props.authenticatedUser.user.pt ? this.props.ptProfile.current_client._id : this.props.clientProfile._id,
            profileData: this.props.data,
            goals: '',
            injuries: '',
            notes: '',
            readonly: this.props.authenticatedUser.user.pt,
            errors: {},
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
        return null
    }

    componentWillUnmount(){
        if(this.props.authenticatedUser.user.pt){
            this.props.clearClientProfileNotes();
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
        }
    }

    render() {
        return (
            <div className="Profile_notes Progression">
                <div className="mt-2 mb-5">
                    <form className="form-group" name="goals" onSubmit={this.onSubmit}>
                        <label className="control-label form-control-lg label-profile">
                            Goals:
                        </label>
                        <textarea
                            readOnly={!this.props.authenticatedUser.user.pt}
                            name="goals"
                            value={this.state.goals}
                            onChange={this.onChange}
                            className="form-control form-control-lg"
                            rows="4" cols="30">
                        </textarea>
                        <input type="submit" value="Update" className="btn btn-info btn-block mt-1"/>
                    </form>
                </div>
                <div className="mt-2 mb-5">
                    <form className="form-group" name="injuries" onSubmit={this.onSubmit}>
                        <label className="control-label form-control-lg label-profile">
                            Injuries/Limitations:
                        </label>
                        <textarea
                            readOnly={!this.props.authenticatedUser.user.pt}
                            name="injuries"
                            value={this.state.injuries}
                            onChange={this.onChange}
                            className="form-control form-control-lg"
                            rows="4" cols="30">
                        </textarea>
                        <input type="submit" value="Update" className="btn btn-info btn-block mt-1"/>
                    </form>
                </div>
                <div className="mt-2 mb-5">
                    <form className="form-group" name="notes" onSubmit={this.onSubmit}>
                        <label className="control-label form-control-lg label-profile">
                            Notes:
                        </label>
                        <textarea
                            readOnly={!this.props.authenticatedUser.user.pt}
                            name="notes"
                            value={this.state.notes}
                            onChange={this.onChange}
                            className="form-control form-control-lg"
                            rows="4" cols="30">
                        </textarea>
                        <input type="submit" value="Update" className="btn btn-info btn-block mt-1"/>
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
    clearClientProfileNotes: PropTypes.func.isRequired
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    ptProfile: state.ptProfile,
    clientProfile: state.clientProfile
});

export default connect(stateToProps, {clearClientProfileNotes, clearProfileNotes, updateClientProfileNotes})(ProfileNotes);
