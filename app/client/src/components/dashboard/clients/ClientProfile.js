import React, {Component} from 'react';  // Used to create this component
import PropTypes from 'prop-types'; // Used to document prop types sent to components
import {connect} from 'react-redux' // Needed when using redux inside a component (connects redux to this component)
import {withRouter} from 'react-router-dom';
import {getClientProgression, clearProgression} from "../../../actions/authenticationActions";
import Graph from "../progression/Graph";
import NewClientProgressForm from "../progression/NewClientProgressForm";
import Modal from 'react-awesome-modal';
import isEmpty from '../../../utilities/is_empty';
import ErrorComponent from "../../error/ErrorComponent";
import Loading from "../../../elements/Loading";

// import FormInputGroup from "../common/FormInputGroup"; // Allows proper routing and linking using browsers match, location, and history properties

class ClientProfile extends Component {
    // This allows the component states to be up{dated and re-rendered
    constructor(props) {
        super(props);
        this.state = {
            client_Progression: props.authenticatedUser.client_Progression,
            userId: props.authenticatedUser.user.id,
            // If user is pt then get clientId from otherwise user is client, so use user.id
            clientId: props.authenticatedUser.clientId !== undefined ? props.authenticatedUser.clientId : props.match.params.cid,
            loaded: false,
            modalWidth: "500",
            modalHeight: "500",
            visible: false, // For modal
            errors: {}
        };

        this.modalSize = this.modalSize.bind(this);

        this.getClientProgression();

        this.openModal = this.openModal.bind(this);
        this.getClientProgression = this.getClientProgression.bind(this);
        this.onClickAway = this.onClickAway.bind(this)
    }

    static getDerivedStateFromProps(props, state){
        if(props.authenticatedUser.client_Progression !== state.client_Progression){
            return {
                client_Progression: props.authenticatedUser.client_Progression,
                loaded: true,
            }
        }

        return null;
    }

    // Life cycle method for react which will run when this component receives new properties
    componentDidMount() {
        document.body.scrollTo(0,0);
    } // did mount

    componentDidUpdate(){
    }

    componentWillUnmount(){
        // This got rid of the Date: null bug for now, need to find route cause!!!
        this.props.clearProgression();

        this.setState({loaded: false})
    }

    modalSize(height){
        this.setState({modalHeight: height});
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
        this.getClientProgression();
    }

    getClientProgression(){
        this.props.getClientProgression(this.state.userId, this.state.clientId, this.props.history);
    }

    render() {
        if(!this.state.loaded){
            return <Loading/>
        }
        if(isEmpty(this.props.authenticatedUser.user)){
            return <ErrorComponent/>
        }
        else{
            let displayContent;
            let clientProgressData = this.state.client_Progression;

            // If client has no data then display appropriate message, otherwise
            if (isEmpty(clientProgressData)) {
                displayContent = (
                    <h2 className="text-center text-info mt-5">No client progression data...</h2>
                )
            }
            else{
                displayContent = (
                    <Graph graphData={clientProgressData}/>
                )
            }

            return (
                <div className="container client-profile">
                    <div className="row">
                        <div className="m-auto col-1 graphs" id="graphs">
                            <h2 className=" text-center display-5 mt-3 mb-4">Client progression data</h2>
                            <h5 className=" text-center display-5 mt-3 mb-4">(Data only shown with 2+ entries)</h5>
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


                    <Modal visible={this.state.visible} width={this.state.modalWidth} height={this.state.modalHeight} effect="fadeInUp"
                           onClickAway={this.onClickAway}>
                        <div>
                            {/*Sending onClickAway into child component NewClientProgress allows the child to affect this parents state!!!
                         Also sending modal visibility so fields and errors can be cleared when visibility is false.
                         Also sending getClientProgression so that the page can be updated once a new progress submission
                           has been successful.*/}
                            <NewClientProgressForm onClickAway={this.onClickAway}
                                                   visible={this.state.visible}
                                                    modalSize={this.modalSize}
                                                   progressFormHeight={this.state.modalHeight}
                            />
                        </div>
                    </Modal>
                </div>
            );
        }
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
