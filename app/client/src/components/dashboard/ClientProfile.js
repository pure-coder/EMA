import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {withRouter} from 'react-router-dom';
import {getClientProgression, clearProgression} from "../../actions/authenticationActions";
import Graph2 from "./Graph";
import NewClientProgressForm from "./NewClientProgressForm";
import Modal from 'react-awesome-modal';
import isEmpty from '../../utilities/is_empty';
import ErrorComponent from "../error/ErrorComponent";

// import FormInputGroup from "../common/FormInputGroup"; // Allows proper routing and linking using browsers match, location, and history properties

class ClientProfile extends Component {
    // This allows the component states to be up{dated and re-rendered
    constructor(props) {
        super(props);
        this.state = {
            userId: props.authenticatedUser.user.id,
            // If user is pt then get clientId from otherwise user is client, so use user.id
            clientId: props.authenticatedUser.clientId !== undefined ? props.authenticatedUser.clientId : props.match.params.cid,
            loaded: false,
            visible: false, // For modal
            errors: {}
        };

        this.openModal = this.openModal.bind(this);
        this.getProgressForPage = this.getProgressForPage.bind(this);
        this.onClickAway = this.onClickAway.bind(this)
    }

    // Life cycle method for react which will run when this component receives new properties
    componentDidMount() {
        document.body.scrollTo(0,0);

        this.authCheck();

        // If direct link used then get client progression data
        if (this.state.loaded === false) {
            this.getProgressForPage();
            this.setState({loaded: true});
        }
    } // did mount

    componentDidUpdate(){
        this.authCheck();
    }

    componentWillUnmount(){
        // This got rid of the Date: null bug for now, need to find route cause!!!
        this.props.clearProgression();
        //this.setState({loaded: false})
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
        this.props.getClientProgression(this.state.userId, this.state.clientId);
    }

    authCheck(){
        // Check if isAuthenticated is true
        if (this.props.errors.error_code === 401) {
            this.props.history.push('/re-login');
        }
    }

    render() {
        console.log(this.props.authenticatedUser.user)
        if(isEmpty(this.props.authenticatedUser.user)){
            console.log(this.props.authenticatedUser.user)
            return <ErrorComponent/>
        }

        let clientProgressData = this.props.authenticatedUser.client_Progression;
        let displayContent;

        // If client has no data then display appropriate message, otherwise
        if (isEmpty(clientProgressData)) {
            displayContent = (
                <h2 className="text-center text-info mt-5">No client progression data...</h2>
            )
        }
        else{
            displayContent = (
                <Graph2 graphData={clientProgressData}/>
            )
        }

        return (
            <div className="container client-profile">
                <div className="row">
                    <div className="m-auto col-1 graphs" id="graphs">
                        <h2 className=" text-center display-5 mt-3 mb-4">Client progression data</h2>
                        {/*Only display Add progress if user is a pt*/}
                        {this.props.authenticatedUser.user.pt === true ?
                            <div>
                                <input id="progress-button" type="button" className="btn btn-success btn-block mt-4 mb-4" value="Add Progress"
                                       onClick={this.openModal} />
                            </div> : null
                        }
                        {/*Display the clients progression data*/}
                        {displayContent}
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

export default connect(stateToProps, {getClientProgression, clearProgression})(withRouter(ClientProfile));
