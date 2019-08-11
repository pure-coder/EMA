import React, {Component} from 'react';
import {addGraph} from "../../../utilities/drawProgressGraph";
import {deleteExercise, ptGetClientBodyBio} from "../../../actions/ptProfileActions";
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import {withRouter} from "react-router-dom";
import Modal from "react-awesome-modal";
import EditBodyDataProgressForm from './EditBodyDataProgressForm';
import DeleteBodyProgressConfirm from "./DeleteBodyProgressConfirm";
import AddBodyDataProgressForm from "./AddBodyDataProgressForm";
import isEmpty from "../../../utilities/is_empty";
import ErrorComponent from "../../error/ErrorComponent";

class BodyGraphComp extends Component {
    constructor(props){
        super(props);
        this.state = {
            userId: props.authenticatedUser.user.id,
            clientId: props.authenticatedUser.user.pt ? props.ptProfile.current_client._id : props.clientProfile.client_data._id,
            bodyMetrics : props.bodyGraphData.bodyMetrics,
            visible: false,
            modalHeight: "400",
            modalWidth: "600",
            form: undefined,
            yMetricName : "measurement",
            xMetricName : "Date",
            yTitle : this.props.bodyGraphData.bodyPart === "Body Weight" ? "Measurement (Kg)" : "Measurement (in)",
            xTitle : "Date",
        };

        this.openModal = this.openModal.bind(this);
        this.onClickAway = this.onClickAway.bind(this);
        this.modalSize = this.modalSize.bind(this);
    }

    openModal(e) {
        if(e.target.value === "Delete"){
            this.setState({form: "Delete"})
        }
        if(e.target.value === "Add Data"){
            this.setState({form: "Add"});
        }
        if(e.target.value === "Edit Data"){
            this.setState({form: "Edit"});
        }
        this.setState({
            visible : true
        });
    }

    onClickAway() {
        this.setState({
            visible: false,
            form: undefined
        });

        // Reset modal size
        this.modalSize("400");

        // Get new data
        this.getBodyBioClient();
    }

    getBodyBioClient(){
        this.props.ptGetClientBodyBio(this.state.clientId, this.props.history);
    }

    modalSize(height){
        this.setState({modalHeight: height});
    }

    sortedProgressionMap(bodyGraphData){
        return bodyGraphData.sort((obj1, obj2) => {
            return new Date(obj1.Date) - new Date(obj2.Date);
        });
    }; // sortedMap

    drawGraph(isUpdate){
        let bodyPartToId = this.props.bodyGraphData.bodyPart.replace(/\s+/g, '-');
        const bodyMetrics = this.sortedProgressionMap(this.props.bodyGraphData.bodyMetrics);
        // Graph is drawn here. Had to make sure className in return was rendered 1st before calling this function
        // as it needs it to append on too.

        addGraph(bodyMetrics, '.' + bodyPartToId, this.props.bodyGraphData.bodyPart, isUpdate, this.state.yMetricName, this.state.xMetricName, this.state.yTitle, this.state.xTitle);
    }

    componentDidMount(){
        this.drawGraph(false);
    }

    componentDidUpdate(prevProps){
        // Only update the bodyPart that has added or deleted metric data
        if(prevProps.bodyGraphData.bodyMetrics !== this.props.bodyGraphData.bodyMetrics) {
            this.setState({bodyMetrics : this.props.bodyGraphData.bodyMetrics});
            this.drawGraph(true)
        }
    }

    render(){
        const {user} = this.props.authenticatedUser;
        const {bodyGraphData} = this.props;
        const ids = {
            userId: this.state.userId,
            clientId: this.state.clientId
        };

        if(isEmpty(user)){
            return <ErrorComponent/>
        }
        let displayForm;

        let display;
        display = (
                (user.pt && bodyGraphData.bodyMetrics.length >= 2 ?
                    (
                        <div className="btn-toolbar progress-toolbar">
                            <div className="col-4 progress-toolbar-space">
                            <input type="button" className="btn btn-info progress-buttons"
                           value="Edit Data" name={bodyGraphData.bodyPart} onClick={this.openModal} />
                            </div>
                            <div className="col-4 progress-toolbar-space">
                            <input type="button" className="btn btn-success progress-buttons"
                                   value="Add Data" name={bodyGraphData.bodyPart} onClick={this.openModal} />
                            </div>
                            <div className="col-4 progress-toolbar-space">
                            <input type="button" className="btn btn-danger progress-buttons"
                           value="Delete" name={bodyGraphData.bodyPart} onClick={this.openModal} />
                            </div>
                        </div>
                    ) : null)


        );

        // Provide component depending on what button was pressed
        if(this.state.form === 'Delete') {
            displayForm = (
                <DeleteBodyProgressConfirm bodyPart={bodyGraphData.bodyPart} onClickAway={this.onClickAway}
                                       visible={this.state.visible}
                                       ids={ids}
                                       modalSize={this.modalSize}
                                       progressFormHeight={this.state.modalHeight}
                />
            )
        }
        if(this.state.form === 'Add') {
            displayForm = (
                <AddBodyDataProgressForm bodyPart={bodyGraphData.bodyPart} onClickAway={this.onClickAway}
                                     visible={this.state.visible}
                                     ids={ids}
                                     modalSize={this.modalSize}
                                     progressFormHeight={this.state.modalHeight}
                />
            )
        }
        if(this.state.form === 'Edit') {
            displayForm = (
                <EditBodyDataProgressForm bodyPart={bodyGraphData.bodyPart}
                                      bodyPartId={bodyGraphData._id}
                                      bodyMetrics={this.state.bodyMetrics}
                                      ids={ids}
                                      onClickAway={this.onClickAway}
                                      visible={this.state.visible}
                                      modalSize={this.modalSize}
                                      progressFormHeight={this.state.modalHeight}
                />
            )
        }

        return (
            <div>
                <div className={bodyGraphData.bodyPart.replace(/\s+/g, '-') + " body-graph"}></div>
                {display}

                <Modal visible={this.state.visible} width={this.state.modalWidth} height={this.state.modalHeight} effect="fadeInUp"
                       onClickAway={this.onClickAway}>
                    {displayForm}
                </Modal>
            </div>
        )
    }
}

BodyGraphComp.propTypes = {
    authenticatedUser: PropTypes.object.isRequired,
    bodyGraphData: PropTypes.object.isRequired,
    ptProfile: PropTypes.object.isRequired,
    clientProfile: PropTypes.object.isRequired,
    deleteExercise: PropTypes.func.isRequired,
    ptGetClientBodyBio: PropTypes.func.isRequired
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    ptProfile: state.ptProfile,
    clientProfile: state.clientProfile,
    errors: state.errors
});

export default connect(stateToProps, {deleteExercise, ptGetClientBodyBio})(withRouter(BodyGraphComp));
