import {connect} from 'react-redux';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import GraphComp from './GraphComp';
import isEmpty from "../../../utilities/is_empty";
import ErrorComponent from "../../error/ErrorComponent";
import Loading from "../../../elements/Loading";
import NewClientProgressForm from "./NewClientProgressForm";
import Modal from "react-awesome-modal";
import {getClientProgression} from "../../../actions/clientProfileActions";
import {ptGetClientProgression, clearErrors, clearSuccess} from "../../../actions/ptProfileActions";
import {NoProgressDataComp} from "../../common/NoProgessDataComp";
import {ProgressTitleComp} from "../../common/ProgressTitleComp";

class Graphs extends Component {
    // This allows the component states to be up{dated and re-rendered)
    constructor(props) {
        super(props);
        this.state = {
            userId: props.authenticatedUser.user.id,
            clientId: props.authenticatedUser.user.pt ? props.match.params.cid : props.authenticatedUser.user.id,
            graphData: props.graphData,
            success: {},
            errors: {},
            modalWidth: "500",
            modalHeight: "500",
            visible: false, // For modal
            loaded: false
        };

        this.getClientProgression = this.getClientProgression.bind(this);
        this.modalSize = this.modalSize.bind(this);
        this.openModal = this.openModal.bind(this);
        this.onClickAway = this.onClickAway.bind(this);
    }

    static getDerivedStateFromProps(props, state){
        if(props.graphData === state.graphData){
            return {
                graphData: props.graphData,
                loaded: true,
            }
        }
        if(props.errors !== state.errors){
            return {
                errors: props.errors,
            }
        }
        return null;
    }

    componentDidUpdate(prevProps){
        if (prevProps.graphData !== this.props.graphData){
            this.setState({graphData: this.props.graphData});
        }
    }

    static sortedProgressionExerciseNames(graphData){
        return graphData.sort((obj1, obj2) => {
            if (obj1.exerciseName > obj2.exerciseName) {
                return 1;
            }
            if (obj1.exerciseName < obj2.exerciseName){
                return -1;
            }
            return 0;
        });
    }; // sortedMap

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
        if(this.props.authenticatedUser.user.pt){
            this.props.ptGetClientProgression(this.state.clientId, this.props.history);
        }
        else{
            this.props.getClientProgression(this.state.clientId, this.props.history);
        }
    }

    render() {
        const {graphData} = this.state;
        if(!this.state.loaded || graphData === undefined || graphData === null){
            return <Loading/>
        }
        if(isEmpty(this.props.authenticatedUser.user)){
            return <ErrorComponent/>
        }
        else{
            let Data = Graphs.sortedProgressionExerciseNames(graphData);
            const graphs = Data.map(graph => {
                if(graph.metrics.length > 1){
                    return (
                        // Changed key from GraphComp to div as div was first child, otherwise error was given.
                        <div className="graphs card mb-5" key={graph._id}>
                            <GraphComp graphData={graph}/>
                        </div>
                    )
                }
                else {
                    return null;
                }
            });
            return (
                <div id="Progression" className="Progression card Progression_head mb-5">
                    <ProgressTitleComp Title="Client progression data"/>
                    {/*Show add progress button only if pt*/}
                    {this.props.authenticatedUser.user.pt === true ?
                        <input id="progress-button" type="button"
                               className="btn btn-success btn-block mt-4 mb-5"
                               value="Add Exercise Progression Data"
                               onClick={this.openModal}/>
                        : null
                    }
                    {/*If enough data show graph/s otherwise show message stating no data to show*/}
                    {
                        !isEmpty(Data) ? graphs : <NoProgressDataComp/>
                    }
                    <Modal visible={this.state.visible} width={this.state.modalWidth} height={this.state.modalHeight} effect="fadeInUp"
                           onClickAway={this.onClickAway}>
                        <div>
                            {/*Sending onClickAway into child component NewClientProgress allows the child to affect this parents state!!!
                             Also sending modal visibility so fields and errors can be cleared when visibility is false.
                             Also sending getClientProgression so that the page can be updated once a new progress submission
                               has been successful.*/}
                            <NewClientProgressForm
                                onClickAway={this.onClickAway}
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

Graphs.propTypes = {
    authenticatedUser: PropTypes.object.isRequired,
    getClientProgression: PropTypes.func.isRequired,
    ptGetClientProgression: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors,
    success: state.success
});

export default connect(stateToProps, {getClientProgression, ptGetClientProgression, clearErrors, clearSuccess})(withRouter(Graphs));
