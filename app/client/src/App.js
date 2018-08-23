import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'; /* mimics server allowing back, forward page routing etc*/
import {Provider} from 'react-redux'; // A react component that provides the store (holds state/data for app) for redux
import store from './store'; // Imports store to be used with redux to hold application state

import Navigation from './components/layout/Navigator'; /*import navbar component*/
import Landing_page from './components/layout/Landing_page'; /*import landing_page component*/
import Footer from './components/layout/Footer'; /*import footer component*/
import Register from './components/authentication/Register'; /*import register component*/
import Login from './components/authentication/Login'; /*import login component*/
import Scheduler from './components/Scheduler/Scheduler';

import './App.css';

// To use tokens for signed in users on every request
import jwtDecode from 'jwt-decode';
import setAuthorisationToken from './utilities/setAuthorisationToken';
import { setSignedInUser } from './actions/authenticationActions';

// check if token exists in local storage
if(localStorage.jwtToken) {
    // Set the token to local storage item 'jwtToken'
    setAuthorisationToken(localStorage.jwtToken);
    // Decode the token so user data can be used and get information and expiration data
    const decodedToken = jwtDecode(localStorage.jwtToken);
    // Call the setSignedInUser action/reducer and set the user and isAuthenticated
    store.dispatch(setSignedInUser(decodedToken));
}

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
                        <div className="container"> {/*This holders the other routes for the app*/}
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
