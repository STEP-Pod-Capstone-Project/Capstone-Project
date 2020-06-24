
import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Login } from './components/Login'
import { BrowserRouter as Router, Route } from 'react-router-dom'


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <body>
        <Router>
          <Route path='/login' component={Login} />
        </Router>
      </body>
    </div>
  );
}

export default App;