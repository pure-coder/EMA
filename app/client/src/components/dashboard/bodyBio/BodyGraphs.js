import {connect} from 'react-redux';
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import BodyGraphComp from './BodyGraphComp';
import isEmpty from "../../../utilities/is_empty";
import ErrorComponent from "../../error/ErrorComponent";
import Loading from "../../common/Loading";
import NewBodyProgressForm from "./NewBodyProgressForm";
import Modal from "react-awesome-modal";
import {clientGetBodyBio} from "../../../actions/clientProfileActions";
import {ptGetClientBodyBio, clearErrors, clearSuccess} from "../../../actions/ptProfileActions";
import {NoProgressDataComp} from "../../common/NoProgessDataComp";
import {ProgressTitleComp} from "../../common/ProgressTitleComp";

class BodyGraphs extends Component {
    // This allows the component states to be up{dated and re-rendered)
    constructor(props) {
        super(props);
        this.state = {
            userId: props.authenticatedUser.user.id,
            clientId: props.match.params.cid,
            bodyGraphData: props.bodyGraphData,
            success: {},
            errors: {},
            modalWidth: "500",
            modalHeight: "500",
            visible: false, // For modal
            loaded: false
        };
    }

    static getDerivedStateFromProps(props, state){
        if(props.bodyGraphData === state.bodyGraphData){
            return {
                bodyGraphData: props.bodyGraphData,
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
        if (prevProps.bodyGraphData !== this.props.bodyGraphData){
            this.setState({bodyGraphData: this.props.bodyGraphData});
        }
    }

    static sortedProgressionBodyPart(bodyGraphData){
        return bodyGraphData.sort((obj1, obj2) => {
            if (obj1.bodyPart > obj2.bodyPart) {
                return 1;
            }
            if (obj1.bodyPart < obj2.bodyPart){
                return -1;
            }
            return 0;
        });
    }; // sortedMap

    modalSize = height => {
        this.setState({modalHeight: height});
    };

    openModal = () => {
        this.setState({
            visible : true
        });
    };

    onClickAway = () => {
        this.setState({
            visible: false
        });
        this.clientGetBodyBio();
    };

    clientGetBodyBio = () => {
        if(this.props.authenticatedUser.user.pt){
            this.props.ptGetClientBodyBio(this.state.clientId);
        }
        else{
            this.props.clientGetBodyBio();
        }
    };

    render() {
        const {bodyGraphData} = this.state;
        if(!this.state.loaded || bodyGraphData === undefined || bodyGraphData === null){
            return <Loading/>
        }
        if(isEmpty(this.props.authenticatedUser.user)){
            return <ErrorComponent/>
        }
        else{
            let Data = BodyGraphs.sortedProgressionBodyPart(bodyGraphData);
            let showData = false;
            const graphs = Data.map(graph => {
                if(graph.bodyMetrics.length > 1){
                    showData = true;
                    return (
                        // Changed key from GraphComp to div as div was first child, otherwise error was given.
                        <div className="graphs card mb-5" key={graph._id}>
                            <BodyGraphComp bodyGraphData={graph}/>
                        </div>
                    )
                }
                else {
                    return null;
                }
            });
            return (
                <div id="Progression" className="Progression card">
                    <ProgressTitleComp Title="Client body progress data"/>
                    {/*Show add progress button only if pt*/}
                    {this.props.authenticatedUser.user.pt === true ?
                        <input id="body-progress-button" type="button"
                               className="btn btn-success btn-block mt-4 mb-5"
                               value="Add Body Progression Data"
                               onClick={this.openModal}/>
                        : null
                    }
                    {/*If enough data show graph/s otherwise show message stating no data to show*/}
                    {
                        showData ? graphs : <NoProgressDataComp/>
                    }
                    <Modal visible={this.state.visible} width={this.state.modalWidth} height={this.state.modalHeight} effect="fadeInUp"
                           onClickAway={this.onClickAway}>
                        <div>
                            {/*Sending onClickAway into child component NewClientProgress allows the child to affect this parents state!!!
                             Also sending modal visibility so fields and errors can be cleared when visibility is false.
                             Also sending clientGetBodyBio so that the page can be updated once a new progress submission
                               has been successful.*/}
                            <NewBodyProgressForm
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

BodyGraphs.propTypes = {
    authenticatedUser: PropTypes.object.isRequired,
    clientGetBodyBio: PropTypes.func.isRequired,
    ptGetClientBodyBio: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    clearSuccess: PropTypes.func.isRequired
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors,
    success: state.success
});

export default connect(stateToProps, {clientGetBodyBio, ptGetClientBodyBio, clearErrors, clearSuccess})(withRouter(BodyGraphs));
