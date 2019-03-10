import React, {Component} from 'react' // React is need for rendering JSX HTML elements in render -> return.
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {newClientProgression} from "../../actions/authenticationActions";
import FormInputGroup from "../common/FormInputGroup";


class NewClientProgress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            clientId: '',
            exerciseName: '',
            metrics: {
                maxWeight: '',
                Date: '',
            },
            errors: {}
        };

        this.onChange = this.onChange.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

    } // constructor

    componentWillReceiveProps(nextProps) {
        if(nextProps.errors){
            this.setState({errors: nextProps.errors})
        }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    onSubmit(e) {
        e.preventDefault();

        const clientProgressData = {
            exerciseName: this.state.exerciseName,
            metrics: {
                maxWeight: this.state.metrics.maxWeight,
                Date: this.state.metrics.Date
            }
        };

        this.props.newClientProgress(this.state.userId, this.state.clientId, clientProgressData);

    } // onSubmit

    render() {

        let {errors} = this.state;

        return (
            <div className="newClientProgress">
                <form onSubmit={this.onSubmit}>
                    <FormInputGroup
                        name="ExerciseName"
                        PlaceHolder="ExerciseName"
                        value={this.state.exerciseName}
                        type="text"
                        onChange={this.onChange}
                        error={errors.exerciseName}
                    />
                    <FormInputGroup
                        name="maxWeight"
                        PlaceHolder="MaxWeight"
                        value={this.state.metrics.maxWeight}
                        type="text"
                        onChange={this.onChange}
                        error={errors.maxWeight}
                    />
                    <FormInputGroup
                        name="Date"
                        PlaceHolder="Date"
                        value={this.state.metrics.Date}
                        type="Date"
                        onChange={this.onChange}
                        error={errors.Date}
                    />
                    <input type="submit" className="btn btn-info btn-block mt-5 mb-5"/>
                </form>
            </div>
        );

    }; // render
}

NewClientProgress.propTypes = {
    newClientProgress: PropTypes.func.isRequired
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors

});


export default connect(stateToProps, {newClientProgression})(withRouter(NewClientProgress));
