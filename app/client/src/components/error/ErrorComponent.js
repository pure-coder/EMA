import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

class ErrorComponent extends Component {

    goBack = () => {
        this.props.history.go(-2);
    };

    render() {
        return (
            <div className="container">
                <div className="ErrorPageNotFound">
                    <div className="ErrorPageNotFound_div">
                        <div className="row">
                            <div className="text-center col-md-12 landing_div text-info">
                                <h3 className="display-1-md display-3-sm">404 - Page Not Found!
                                </h3>
                                <button type="button" className="btn btn-success btn-block mt-5 mb-3 error-button" onClick={this.goBack}>Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// connect must be exported with a passed parameter (not direct parameter) of Landing page this is wrapped with withRouter
// allowing the functions of the package to be used with the component eg, proper routing, and direct parameters of
// stateToProps for the 1st parameter and the action which is registerUser as the 2nd parameter
export default connect()(withRouter(ErrorComponent));
