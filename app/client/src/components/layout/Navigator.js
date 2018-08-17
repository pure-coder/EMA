import React, {Component} from 'react';

class Navigation extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-sm navbar-dark navbar-custom mb-5">
                <div className="container">
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
                                <a className="nav-link" href="#">Sign Up</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Login</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navigation;