import React, { Component } from 'react';
import Navigation from './components/layout/Navigator';
import Landing_page from './components/layout/Landing_page';
import Footer from './components/layout/Footer';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App" id="wrap">
        <Navigation/>
        <Landing_page id="main"/>
          <Footer/>
      </div>
    );
  }
}

export default App;
