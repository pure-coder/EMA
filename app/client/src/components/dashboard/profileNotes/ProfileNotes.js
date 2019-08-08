import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";

class ProfileNotes extends Component {
    constructor(props){
        super(props);
        this.state = {
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

    onChange(e){
        e.preventDefault();
        let name = e.target.name;
        let value = e.target.value;
        this.setState({[name]: value});
    }

    onSubmit(){

    }

    render() {
        return (
            <div className="Profile_notes Progression">
                <div className="mt-2 mb-5">
                    <label>
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
                </div>
                <div className="mt-2 mb-5">
                    <label>
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
                </div>
                <div className="mt-2 mb-5">
                    <label>
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
                </div>
            </div>
        )
    }
}

ProfileNotes.propTypes = {
    authenticatedUser: PropTypes.object.isRequired
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser
});

export default connect(stateToProps, {})(ProfileNotes);
