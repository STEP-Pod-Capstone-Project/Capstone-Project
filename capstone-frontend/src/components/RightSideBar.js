import React, { Component } from 'react';
import '../App.css';

class RightSideBar extends Component {
  render() {
    return (
      <div id="right-sidebar-container" className="sidebar-expanded d-none d-md-block col-2 sidebar-container">
        Space for a user feed!
      </div>
    );
  }
}

export default RightSideBar;