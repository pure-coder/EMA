import React, {Component} from 'react' // React is need for rendering JSX HTML elements in render -> return.
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {newClientProgress} from "../../actions/authenticationActions";
import FormInputGroup from "../common/FormInputGroup";
import is_Empty from '../../utilities/is_empty';


class NewClientProgress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.authenticatedUser.user.id,
            clientId: props.match.params.Cid,
            exerciseName: '',
            maxWeight: '',
            Date: '',
            errors: {}
        };

        this.onChange = this.onChange.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        this.onClick= this.onClick.bind(this);
    } // constructor

    static getDerivedStateFromProps(props, state) {
        if (props.visibility !== state.visible) {
            return {visible: props.visibility}
        }
        if (props.errors !== state.errors) {
            return {errors: props.errors}
        }
        return null
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    onClick(){
        // The use of onClick with this.props.onClickAway() allows this to call the parents onClickAway (note the use of props)
        // moved from below so checks can be made before it is closed (that no errors were given)
        console.log(this.props, this.state)
        if(!is_Empty(this.props.errors)){
            this.props.onClickAway();
        }
    }

    onSubmit(e) {
        e.preventDefault();

        const clientProgressData = {
            exerciseName: this.state.exerciseName,
            metrics: {
                maxWeight: this.state.maxWeight,
                Date: new Date(this.state.Date)
            }
        };

        this.props.newClientProgress(this.state.userId, this.state.clientId, clientProgressData);

    } // onSubmit

    render() {

        let {errors} = this.state;
        return (
            <div className="newClientProgress">
                <form onSubmit={this.onSubmit}>
                    <label className="control-label form-control-lg edit-profile-label">
                        Exercise:
                    </label>
                    <FormInputGroup
                        name="exerciseName"
                        PlaceHolder="Exercise Name"
                        value={this.state.exerciseName}
                        type="text"
                        onChange={this.onChange}
                        error={errors.exerciseName}
                    />
                    <label className="control-label form-control-lg edit-profile-label">
                        One Rep Max Weight (Kg):
                    </label>
                    <FormInputGroup
                        name="maxWeight"
                        PlaceHolder="Max Weight"
                        value={this.state.maxWeight}
                        type="text"
                        onChange={this.onChange}
                        error={errors.maxWeight}
                    />
                    <label className="control-label form-control-lg edit-profile-label">
                        Date:
                    </label>
                    <FormInputGroup
                        name="Date"
                        PlaceHolder="Date"
                        value={this.state.Date}
                        type="Date"
                        onChange={this.onChange}
                        error={errors.Date}
                    />
                    <input type="submit" className="btn btn-info btn-block mt-5 mb-5 " onClick={this.onClick}/>
                </form>
            </div>
        );

    }; // render
}

NewClientProgress.propTypes = {
    newClientProgress: PropTypes.func.isRequired,
    authenticatedUser: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors

});


export default connect(stateToProps, {newClientProgress})(withRouter(NewClientProgress));
