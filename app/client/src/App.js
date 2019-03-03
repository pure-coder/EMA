import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'; // mimics server allowing back, forward page routing etc
import {Provider} from 'react-redux'; // A react component that provides the store (holds state/data for app) for redux
import store from './store'; // Imports store to be used with redux to hold application state
import 'axios';
/*import navbar component*/
import Navigation from './components/layout/Navigator';
/*import landing_page component*/
import Landing_page from './components/layout/Landing_page';
/*import footer component*/
import Footer from './components/layout/Footer';
/*import register component*/
import Register from './components/authentication/Register';
/*import register client component*/
import RegisterClient from './components/authentication/RegisterClient';
/*import login component*/
import Login from './components/authentication/Login';
/*import scheduler component*/
import Scheduler from './components/scheduler/Scheduler';
/*import dashboard component*/
import Dashboard from './components/dashboard/Dashboard'
import Dashboard2 from './components/dashboard/Dashboard2'
/*import edit client component*/
import EditClient from './components/dashboard/EditClient'

import ErrorComponent from './components/error/ErrorComponent';
/* import PrivateRoute function for authorised access of pages */
import PrivateRoute from './elements/PrivateRoute';

import './App.css';


// To use tokens for signed in users on every request
import jwtDecode from 'jwt-decode';
import setAuthorisationToken from './utilities/setAuthorisationToken';
import {setSignedInUser} from './actions/authenticationActions';

// Used to log the user out
import {logOutUser} from './actions/authenticationActions';
import EditPersonalTrainer from "./components/dashboard/EditPersonalTrainer";

// check if token exists in local storage
if (localStorage.jwtToken) {
    // Set the token to local storage item 'jwtToken'
    setAuthorisationToken(localStorage.jwtToken);
    // Decode the token so user data can be used and get information and expiration data
    const decodedToken = jwtDecode(localStorage.jwtToken);
    // Call the setSignedInUser action/reducer and set the user and isAuthenticated
    store.dispatch(setSignedInUser(decodedToken));

    // I have set the jwt token in the REST API to expire in 1 hr, so they will have to log back in
    // - Delete the jwt token given in the expiration.
    const currentTime = Date.now() / 1000; // convert to milliseconds
    if (decodedToken.exp < currentTime) {
        // Log the user out
        store.dispatch(logOutUser());
        // Redirect the user to the login page
        window.location.href = '/login';
    } // if decodedToken
} // if localStorage.jwtToken


class App extends Component {

    render() {
        return (
            <Provider store={store}>
                <Router>
                    {/* Wrap the App div with Router so the functionality can be used  */}
                    <div className="App">
                        <Navigation/> {/*adds navbar component to web app*/}
                        {/*Using Switch allows the route to be checked to see if it exists or not, if not the last component (error) which doesn't have a path
                         will be rendered*/}
                        <Switch>
                            {/* Register Scheduler below uses restful url*/}
                            {/* Register_client below uses restful url*/}
                            <PrivateRoute path="/users/:uid?/edit_client" component={EditClient}/>
                            <PrivateRoute path="/users/:uid?/register_client" component={RegisterClient}/>
                            <PrivateRoute path="/users/:uid?/scheduler/:Cid?" component={Scheduler}/>
                            {/* Register Dashboard below uses restful url*/}
                            <PrivateRoute path="/users/:uid?/dashboard/:Cid?" component={Dashboard}/>
                            <PrivateRoute path="/users/:uid?/dashboard2/:Cid?" component={Dashboard2}/>
                            <PrivateRoute path="/users/:uid?/edit_client" component={EditClient}/>
                            <PrivateRoute path="/users/:uid?/edit_personal_trainer" component={EditPersonalTrainer}/>

                            <Route exact path="/"
                                   component={Landing_page}/> {/* using Route functionality that adds the landing_page component to web app*/}
                            <Route exact path="/register" component={Register}/>
                            <Route exact path="/login" component={Login}/>
                            <Route exact path="/error_page" component={ErrorComponent}/>
                            <Route component={ErrorComponent}/>
                            {/*If page doesn't exist * then show error page component*/}

                        </Switch>
                        <Footer/> {/*adds footer component to web app*/}
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
