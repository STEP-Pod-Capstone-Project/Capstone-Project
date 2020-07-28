import React, { Component } from 'react';
import '../App.css';

class Home extends Component {
  render() {
    return (
      <div>
        <h1 className="text-center">Clubs</h1> 
        <hr className="light-gray-border"/>
        <div> Your Books </div>
        <div> Your Lists </div>
        <div> Your Clubs </div>
      </div>
    );
  }
}

export default Home;