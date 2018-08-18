import React, { Component } from 'react';

import {BrowserRouter as Router, Route} from 'react-router-dom'; /* mimics server allowing back, forward page routing etc*/

import Navigation from './components/layout/Navigator'; /*import navbar component*/
import Landing_page from './components/layout/Landing_page'; /*import landing_page component*/
import Footer from './components/layout/Footer'; /*import footer component*/


import './App.css';

class App extends Component {
  render() {
    return (
        <Router>
            {/* Wrap the App div with Router so the functionality can be used  */}
            <div className="App" id="wrap">
                <Navigation/> {/*adds navbar component to web app*/}
                <Route exact path="/" component={Landing_page} /> {/* using Route functionality that adds the landing_page component to web app*/}
                <Footer/> {/*adds footer component to web app*/}
            </div>
        </Router>
    );
  }
}

export default App;
