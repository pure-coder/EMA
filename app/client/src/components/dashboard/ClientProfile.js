import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {withRouter} from 'react-router-dom';
import {getClientProgression, clearProgression, deleteExercise} from "../../actions/authenticationActions";
import Loading from "../../elements/Loading";
import Graph from "./Graph";
import Graph2 from "./Graph2";
import NewClientProgressForm from "./NewClientProgressForm";
import Modal from 'react-awesome-modal';

// import FormInputGroup from "../common/FormInputGroup"; // Allows proper routing and linking using browsers match, location, and history properties

class ClientProfile extends Component {
    // This allows the component states to be up{dated and re-rendered
    constructor(props) {
        super(props);
        this.state = {
            userId: props.authenticatedUser.user.id,
            // If user is pt then get clientId from otherwise user is client, so use user.id
            clientId: props.authenticatedUser.clientId !== undefined ? props.authenticatedUser.clientId : props.match.params.Cid,
            selectedExercise: 'Squat',
            loaded: false,
            visible: false, // For modal
            errors: {}
        };

        this.openModal = this.openModal.bind(this);
        this.deleteExercise = this.deleteExercise.bind(this);
        this.getProgressForPage = this.getProgressForPage.bind(this);
        this.onClickAway = this.onClickAway.bind(this)
    }

    // Life cycle method for react which will run when this component receives new properties
    componentDidMount() {
        document.body.scrollTo(0,0);

        // Check if isAuthenticated is true then redirect to the dashboard
        if (!this.props.authenticatedUser.isAuthenticated) {
            this.props.history.push('/login');
        }

        // If direct link used then get client progression data
        if (this.state.loaded === false) {
            this.getProgressForPage();
            this.setState({loaded: true});
        }

    } // did mount

    componentWillUnmount(){
        // This got rid of the Date: null bug for now, need to find route cause!!!
        this.props.clearProgression();
        this.setState({loaded: false})
    }

    openModal() {
        this.setState({
            visible : true
        });
    }

    onClickAway() {
        this.setState({
            visible: false
        });
        this.getProgressForPage();
    }

    getProgressForPage(){
        this.props.getClientProgression(this.state.userId, this.state.clientId, this.props.history);
    }

    deleteExercise(){
        this.props.deleteExercise(this.state.userId, this.state.clientId, this.state.selectedExercise);
    }

    render() {
        let displayContent;

        if (!this.props.authenticatedUser.client_Progression) {
            return <Loading/>
        }

        // Check to see that client_progression is not undefined or the return data for client_progression is not empty
        if (this.props.authenticatedUser.client_Progression) {
            // console.log(this.props.authenticatedUser.client_Progression[2])
            displayContent = (
                <Graph graphData={this.props.authenticatedUser.client_Progression}/>
            )
        } // if client_progression is not undefined

        return (
            <div className="container dashboard-custom">
                <div className="row">
                    <div className="m-auto col-1 graphs" id="graphs">
                        <h1 className=" text-center display-5 mb-3">Dashboard</h1>
                        <h2 className=" text-center display-5 mt-3 mb-4">Client progression data</h2>
                {/*Only display Add progress if user is a pt*/}
                {this.props.authenticatedUser.user.pt === true && this.props.authenticatedUser.client_Progression ?
                    <div>
                        <input id="progress-button" type="button" className="btn btn-success btn-block mb-4" value="Add Progress" onClick={this.openModal} />
                        <input id="edit-progress-button" type="button" className="btn btn-info btn-block mb-4" value="Edit Exercise" onClick={this.openModal} />
                        <input id="delete-progress-button" type="button" className="btn btn-danger btn-block mb-4" value="Delete Exercise" onClick={this.deleteExercise} />
                    </div>
                    : null
                }
                {displayContent}
                <Graph2 graphData={this.props.authenticatedUser.client_Progression}/>
                    </div>
                </div>
                <Modal visible={this.state.visible} width="500" height="450" effect="fadeInUp"
                       onClickAway={this.onClickAway}>
                    <div>
                        {/*Sending onClickAway into child component NewClientProgress allows the child to affect this parents state!!!
                         Also sending modal visibility so fields and errors can be cleared when visibility is false.
                         Also sending getClientProgression so that the page can be updated once a new progress submission
                           has been successful.*/}
                        <NewClientProgressForm onClickAway={this.onClickAway}
                                           visible={this.state.visible}
                        />
                    </div>
                </Modal>
            </div>
        );

    }
}

// Documents what props are needed for this component and will log a warning in the console in dev mode if not complied to
ClientProfile.propTypes = {
    authenticatedUser: PropTypes.object.isRequired,
    getClientProgression: PropTypes.func.isRequired,
    clearProgression: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
};

// Used to pull auth state and errors into this component
const stateToProps = (state) => {
    return {
    authenticatedUser: state.authenticatedUser,
    errors: state.errors
}};

export default connect(stateToProps, {getClientProgression, clearProgression, deleteExercise})(withRouter(ClientProfile));
