import React, {Component} from 'react';
import {Link} from 'react-router-dom'; /*This will be used instead of the anchor tag for routing*/

class Landing_page extends Component {

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

export default Landing_page;
