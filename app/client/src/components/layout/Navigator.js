import React, {Component} from 'react';
import {Link} from 'react-router-dom'; {/*This will be used instead of the anchor tag for routing*/}

class Navigation extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-sm navbar-dark navbar-custom mb-5">
                <div className="container navbar-container">
                    <a className="navbar-brand" href="#">
                        <img src={require('../../img/logo.jpg')} alt={"Fitness app logo"}></img>
                        Fitness App
                    </a>
                    <button className="navbar-toggler" type="button" data-target="#mobile-navigation" data-toggle="collapse">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="mobile-navigation">

                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/register">
                                    Sign Up
                                </Link> {/*Using Link instead of anchor tag*/}
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">
                                    Login
                                </Link> {/*Using Link instead of anchor tag*/}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navigation;