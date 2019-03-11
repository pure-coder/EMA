import React, {Component} from 'react' // React is need for rendering JSX HTML elements in render -> return.
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {newClientProgress} from "../../actions/authenticationActions";
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
                    <FormInputGroup
                        name="exerciseName"
                        PlaceHolder="Exercise Name"
                        value={this.state.exerciseName}
                        type="text"
                        onChange={this.onChange}
                        error={errors.exerciseName}
                    />
                    <FormInputGroup
                        name="maxWeight"
                        PlaceHolder="Max Weight"
                        value={this.state.maxWeight}
                        type="text"
                        onChange={this.onChange}
                        error={errors.maxWeight}
                    />
                    <FormInputGroup
                        name="Date"
                        PlaceHolder="Date"
                        value={this.state.Date}
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
    newClientProgress: PropTypes.func.isRequired,
    authenticatedUser: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
    errors: state.errors

});


export default connect(stateToProps, {newClientProgress})(withRouter(NewClientProgress));
