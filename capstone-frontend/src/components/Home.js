import React, { Component } from 'react';
import { SearchUserModal } from './SearchUserModal'
import '../App.css';

class Home extends Component {
  render() {
    return (
      <div>
        <div> Your Books </div>
        <div> Your Lists </div>
        <div> Your Clubs </div>
        <SearchUserModal/>
      </div>
    );
  }
}

export default Home;