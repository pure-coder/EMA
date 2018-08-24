import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';


class ErrorComponent extends Component {
    render() {
        return (
            <div className="ErrorPageNotFound">
                <div className="container ErrorPageNotFound_div">
                    <div className="row">
                        <div className="text-center col-md-12 landing_div text-info">
                            <h1 className="display-1-md display-3-sm">404 - Page Not Found!
                            </h1>
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
