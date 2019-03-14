import React, {Component} from 'react' // React is need for rendering JSX HTML elements in render -> return.
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {newClientProgress} from "../../actions/authenticationActions";
import autocomplete from '../../utilities/autoComplete';
import FormInputGroup from "../common/FormInputGroup";


class NewClientProgress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.authenticatedUser.user.id,
            clientId: props.match.params.Cid,
            exerciseName: '',
            maxWeight: '',
            Date: '',
            errors: {},
            success: '',
            exercises : ['Bench Press', 'squat'],
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
            return {
                success: "",
                errors: props.errors
            }
        }
        if (props.success !== state.success) {
            return {success: props.success}
        }
        return null
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
        if(e.target.name === "exerciseName"){
            console.log("something")
            autocomplete(e.target.value, this.state.exercises );
        }
    }

    onClick(){
        // The use of onClick with this.props.onClickAway() allows this to call the parents onClickAway (note the use of props)
        this.props.onClickAway();
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
                <div>
                    <button className="closeButton"  onClick={this.onClick}><i className="fas fa-window-close 2x"></i></button>
                </div>
                <form autoComplete="off" onSubmit={this.onSubmit}>
                    <label className="control-label form-control-lg edit-profile-label">
                        Exercise:
                    </label>
                    <div className="autocomplete">
                        <FormInputGroup
                            name="exerciseName"
                            PlaceHolder="Exercise Name"
                            value={this.state.exerciseName}
                            id="exerciseName"
                            type="text"
                            onChange={this.onChange}
                            error={errors.exerciseName}
                        />
                    </div>
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
                    <div className="valid-feedback">{this.state.success.msg}</div>
                    <input type="submit" className="btn btn-info btn-block mt-2 mb-5"/>
                </form>
            </div>
        );

    }; // render
}

NewClientProgress.propTypes = {
    newClientProgress: PropTypes.func.isRequired,
    authenticatedUser: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    success: PropTypes.object.isRequired
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors,
    success: state.success
});


export default connect(stateToProps, {newClientProgress})(withRouter(NewClientProgress));
