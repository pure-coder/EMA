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
import Dashboard from './components/dashboard/profile/Dashboard'
import ClientProfile from './components/dashboard/clients/ClientProfile'
/*import edit client component*/
import EditClient from './components/dashboard/edit/EditClient'

import ErrorComponent from './components/error/ErrorComponent';
/* import PrivateRoute function for authorised access of pages */
import PrivateRoute from './elements/PrivateRoute';
import './App.css';
import EditPersonalTrainer from "./components/dashboard/edit/EditPersonalTrainer";
import ExpiredLogin from "./components/authentication/ExpiredLogin";
import setAuthorisationToken from "./utilities/setAuthorisationToken";
import jwtDecode from "jwt-decode";
import {setSignedInUser} from "./actions/authenticationActions";
import ProfilePicUpload from "./components/dashboard/edit/ProfilePicUpload";

// Check if user is signed in if page is refreshed, if so then dispatch that they are already signed in.
if (localStorage.jwtToken) {
    // Set the token to local storage item 'jwtToken'
    setAuthorisationToken(localStorage.jwtToken);
    // Decode the token so user data can be used and get information and expiration data
    const decodedToken = jwtDecode(localStorage.jwtToken);
    // Call the setSignedInUser action/reducer and set the user and isAuthenticated
    // I have set the jwt token in the REST API to expire in 1 hr, so they will have to log back in
    // - Delete the jwt token given in the expiration.
    store.dispatch(setSignedInUser(decodedToken));
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
                            <PrivateRoute path="/users/:uid?/edit_client/:cid?" component={EditClient}/>
                            <PrivateRoute path="/users/:uid?/register_client" component={RegisterClient}/>
                            <PrivateRoute path="/users/:uid?/scheduler/:cid?" component={Scheduler}/>
                            {/* Register Dashboard below uses restful url*/}
                            <PrivateRoute path="/users/:uid?/dashboard/:cid?" component={Dashboard}/>
                            <PrivateRoute path="/users/:uid?/upload_profile_picture" component={ProfilePicUpload}/>
                            <PrivateRoute path="/users/:uid?/client_profile/:cid?" component={ClientProfile}/>
                            <PrivateRoute path="/users/:uid?/edit_personal_trainer" component={EditPersonalTrainer}/>

                            <Route exact path="/"
                                   component={Landing_page}/> {/* using Route functionality that adds the landing_page component to web app*/}
                            <Route exact path="/register" component={Register}/>
                            <Route exact path="/login" component={Login}/>
                            <Route exact path="/re-login" component={ExpiredLogin}/>
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
