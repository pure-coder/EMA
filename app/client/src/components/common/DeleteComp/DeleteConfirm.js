import React, {Component} from 'react' // React is need for rendering JSX HTML elements in render -> return.
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {ptDeleteClient} from "../../../redux/actions/ptProfileActions";


class DeleteConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progressFormHeight: props.progressFormHeight,
        };
    } // constructor

    static getDerivedStateFromProps(props, state) {
        if (props.progressFormHeight !== state.progressFormHeight) {
            return {
                progressFormHeight: state.progressFormHeight
            }
        }
        return null;
    }

    // Get height of Modal
    static getModalHeight(){
        let formHeight;
        let el = document.querySelector(".delete-confirm");
        formHeight = el.offsetHeight;
        formHeight += parseInt(window.getComputedStyle(el).getPropertyValue('margin-top'), 10);
        formHeight += parseInt(window.getComputedStyle(el).getPropertyValue('margin-bottom'), 10);
        return formHeight;
    }

    componentDidUpdate(prevProps){
        // Get's height of Modal after the page has updated (changed) and compares it to previous state, if state
        // is not equal then update size of Modal
        let formHeight = DeleteConfirm.getModalHeight();
        if(formHeight !== prevProps.progressFormHeight ){
            this.props.modalSize(formHeight.toString())
        }
    }

    onCancel = () => {
        this.props.onClickAway();
    };

    onConfirm = () => {
        this.props.ptDeleteClient(this.props.clientId, this.props.history);
        this.props.onClickAway();
    };

    render() {
        return (
            <div className="delete-confirm">
                <h2 className="mt-3 mb-3"> Are you sure you want to delete data for {this.props.name}? </h2>
                <div className="confirm-buttons">
                    <input id="confirm" type="button" className="btn btn-success btn-block mb-4"
                           value="Confirm" onClick={this.onConfirm} />
                    <input id="cancel" type="button" className="btn btn-danger btn-block mb-4"
                           value="Cancel" onClick={this.onCancel} />
                </div>
            </div>
        );

    }; // render
}

DeleteConfirm.propTypes = {
    ptDeleteClient: PropTypes.func.isRequired,
    modalSize: PropTypes.func.isRequired,
    progressFormHeight: PropTypes.string.isRequired,
};


export default connect(null, {ptDeleteClient})(withRouter(DeleteConfirm));
