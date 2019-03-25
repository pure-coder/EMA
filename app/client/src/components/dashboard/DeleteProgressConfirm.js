import React, {Component} from 'react' // React is need for rendering JSX HTML elements in render -> return.
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {deleteExercise} from "../../actions/authenticationActions";


class DeleteProgressConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.authenticatedUser.user.id,
            clientId: props.match.params.cid,
        };
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    } // constructor

    componentDidMount(){
        document.body.scrollTo(0,0);
    }

    onCancel(){
        this.props.onClickAway();
    }

    onConfirm(e){
        this.props.deleteExercise(this.state.userId, this.state.clientId, e.target.name);
        this.props.onClickAway();
    }

    render() {
        return (
            <div className="delete-progress">
                <h2 className="mt-3 mb-3"> Are you sure you want to delete the progress data for {this.props.exerciseName}! </h2>
                <input id="confirm" type="button" className="btn btn-success btn-block mb-4"
                       value="Confirm" name={this.props.exerciseName} onClick={this.onConfirm} />
                <input id="cancel" type="button" className="btn btn-danger btn-block mb-4"
                       value="Cancel" onClick={this.onCancel} />
            </div>
        );

    }; // render
}

DeleteProgressConfirm.proptypes = {
    deleteExercise: PropTypes.func.isRequired
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors,
    success: state.success
});


export default connect(stateToProps, {deleteExercise})(withRouter(DeleteProgressConfirm));
