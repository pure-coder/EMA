import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';


class Landing_page extends Component {
    // Life cycle method for react which will run when this component receives new properties
    componentDidMount() {
        // Check if isAuthenticated is true then redirect to the dashboard
        if (this.props.authenticatedUser.isAuthenticated) {
            this.props.history.push('/users/' + this.props.authenticatedUser.user.id + '/dashboard');
        }
    }

    render() {
        return (
            <div className="landing_page">
                <div className="container landing_div">
                    <div className="row">
                        <div className="text-center col-md-12 landing_div text-info">
                            <h1 className="display-1-md display-3-sm">Fitness App
                            </h1>
                            <p className="description"> Create and view Workouts, Schedules and communicate easily
                                with this fitness application.</p>
                            <Link to="/register" className="btn mr-4 btn-info btn-lg">
                                Sign Up
                            </Link> {/*Using Link instead of anchor tag*/}
                            <Link to="/login" className="btn btn-light btn-lg">
                                Login
                            </Link> {/*Using Link instead of anchor tag*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// Documents what props are needed for this component and will log a warning in the console in dev mode if not complied to
Landing_page.propTypes = {
    authenticatedUser: PropTypes.object.isRequired,
};

// Used to pull auth state into this component
const stateToProps = (state) => ({
    authenticatedUser: state.authenticatedUser,
});


// connect must be exported with a passed parameter (not direct parameter) of Landing page this is wrapped with withRouter
// allowing the functions of the package to be used with the component eg, proper routing, and direct parameters of
// stateToProps for the 1st parameter and the action which is registerUser as the 2nd parameter
export default connect(stateToProps, { })(withRouter(Landing_page));
