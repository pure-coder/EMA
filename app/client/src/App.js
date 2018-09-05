import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'; /* mimics server allowing back, forward page routing etc*/
import {Provider} from 'react-redux'; // A react component that provides the store (holds state/data for app) for redux
import store from './store'; // Imports store to be used with redux to hold application state
import 'axios';
import Navigation from './components/layout/Navigator'; /*import navbar component*/
import Landing_page from './components/layout/Landing_page'; /*import landing_page component*/
import Footer from './components/layout/Footer'; /*import footer component*/
import Register from './components/authentication/Register'; /*import register component*/
import RegisterClient from './components/authentication/RegisterClient'; /*import register client component*/
import Login from './components/authentication/Login'; /*import login component*/
import Scheduler from './components/scheduler/Scheduler'; /*import scheduler component*/
import Dashboard from './components/dashboard/Dashboard' /*import dashboard component*/
import ErrorComponent from './components/error/ErrorComponent';

import './App.css';

// To use tokens for signed in users on every request
import jwtDecode from 'jwt-decode';
import setAuthorisationToken from './utilities/setAuthorisationToken';
import { setSignedInUser } from './actions/authenticationActions';

// Used to log the user out
import { logOutUser } from './actions/authenticationActions';

// check if token exists in local storage
if(localStorage.jwtToken) {
    // Set the token to local storage item 'jwtToken'
    setAuthorisationToken(localStorage.jwtToken);
    // Decode the token so user data can be used and get information and expiration data
    const decodedToken = jwtDecode(localStorage.jwtToken);
    // Call the setSignedInUser action/reducer and set the user and isAuthenticated
    store.dispatch(setSignedInUser(decodedToken));

    // I have set the jwt token in the REST API to expire in 1 hr, so they will have to log back in
    // - Delete the jwt token given in the expiration.
    const currentTime = Date.now() / 1000; // convert to milliseconds
    if(decodedToken.exp < currentTime) {
        // Log the user out
        store.dispatch(logOutUser());
        // TODO: clear current profile data on logout and redirect to login page

        // Redirect the user to the login page
        window.location.href = '/login';
    }

}

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router>
                    {/* Wrap the App div with Router so the functionality can be used  */}
                    <div className="App">
                        <Navigation/> {/*adds navbar component to web app*/}
                        {/*Using Switch let the route be checked if it exist or not, if not the last component (error) which doesn't have a path
                         will be rendered*/}
                        <Switch>
                            <Route exact path="/"
                                   component={Landing_page}/> {/* using Route functionality that adds the landing_page component to web app*/}
                                <Route exact path="/register" component={Register}/>
                                <Route exact path="/register_client" component={RegisterClient}/>
                                <Route exact path="/login" component={Login}/>
                                <Route exact path="/scheduler/:id?" component={Scheduler}/>
                                <Route exact path="/dashboard/:id?" component={Dashboard}/>

                                {/*If page doesn't exist * then show error page component*/}
                                <Route component={ErrorComponent} />
                        </Switch>
                        <Footer/> {/*adds footer component to web app*/}
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
