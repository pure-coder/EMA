import React, {Component} from 'react' // React is need for rendering JSX HTML elements in render -> return.
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {deleteExercise} from "../../../actions/profileActions";


class DeleteProgressConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.authenticatedUser.user.id,
            clientId: props.match.params.cid,
            progressFormHeight: props.progressFormHeight,
        };
        this.onCancel = this.onCancel.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    } // constructor

    static getDerivedStateFromProps(props, state) {
        if (props.progressFormHeight < state.progressFormHeight) {
            return {
                progressFormHeight: props.progressFormHeight
            }
        }
        return null;
    }

    componentDidMount(){
        let formHeight;
        let el = document.querySelector(".delete-progress");
        formHeight = el.offsetHeight;
        formHeight += parseInt(window.getComputedStyle(el).getPropertyValue('margin-top'), 10);
        formHeight += parseInt(window.getComputedStyle(el).getPropertyValue('margin-bottom'), 10);
        this.setState({progressFormHeight: formHeight});
    }

    componentDidUpdate(prevProps){
        if(this.state.progressFormHeight < prevProps.progressFormHeight ){
            let newHeight = this.state.progressFormHeight;
            this.props.modalSize(newHeight.toString())
        }
    }

    onCancel(){
        this.props.onClickAway();
    }

    onConfirm(e){
        this.props.deleteExercise(this.state.userId, this.state.clientId, e.target.name, this.props.history);
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
    deleteExercise: PropTypes.func.isRequired,
    modalSize: PropTypes.func.isRequired,
    progressFormHeight: PropTypes.string.isRequired,
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors,
    success: state.success
});


export default connect(stateToProps, {deleteExercise})(withRouter(DeleteProgressConfirm));
