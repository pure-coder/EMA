import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'; /* mimics server allowing back, forward page routing etc*/
import {Provider} from 'react-redux'; // A react component that provides the store (holds state/data for app) for redux
import store from './store'; // Imports store to be used with redux to hold application state
import classnames from 'classnames';


import Navigation from './components/layout/Navigator'; /*import navbar component*/
import Landing_page from './components/layout/Landing_page'; /*import landing_page component*/
import Footer from './components/layout/Footer'; /*import footer component*/
import Register from './components/authentication/Register'; /*import register component*/
import Login from './components/authentication/Login'; /*import login component*/
import Scheduler from './components/Scheduler/Scheduler';

import './App.css';

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    {/* Wrap the App div with Router so the functionality can be used  */}
                    <div className="App">
                        <Navigation/> {/*adds navbar component to web app*/}
                        <Route exact path="/"
                               component={Landing_page}/> {/* using Route functionality that adds the landing_page component to web app*/}
                        <div className={classnames(null , {"container-custom": document.getElementsByClassName('landing_page')[0] === undefined ? false : true})}> {/*This holders the other routes for the app*/}
                            <Route exact path="/register" component={Register}/>
                            <Route exact path="/login" component={Login}/>
                            <Route exact path="/Scheduler" component={Scheduler}/>
                        </div>

                        <Footer/> {/*adds footer component to web app*/}
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
