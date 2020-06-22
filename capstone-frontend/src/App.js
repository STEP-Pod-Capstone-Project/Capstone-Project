import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { TestApi } from "./components/TestApi";

function App() {
  return (
    <div>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> No save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <TestApi />
    </div>
  );
}

export default App;
