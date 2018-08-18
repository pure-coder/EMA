import React, { Component } from 'react';
import Navigation from './components/layout/Navigator';
import Footer from './components/layout/Footer';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navigation/>
        <h1>
            Welcome page!
        </h1>
          <Footer/>
      </div>
    );
  }
}

export default App;
