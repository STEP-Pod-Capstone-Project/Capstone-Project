import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

class LeftSideBar extends Component {
  render() {
    return (
      <div id="left-sidebar-container" className="sidebar-expanded d-none d-md-block col-2">
        <ul className="list-group sticky-top sticky-offset">
          <Link to="/" className="bg-dark list-group-item list-group-item-action">
            <div className="d-flex w-100 justify-content-start align-items-center">
              <span className="fa fa-tasks fa-fw mr-3"></span>
              <span id="home-link" className="menu-collapsed"> Home </span>
            </div>
          </Link>
          <Link to="/browse" className="bg-dark list-group-item list-group-item-action">
            <div className="d-flex w-100 justify-content-start align-items-center">
              <span className="fa fa-tasks fa-fw mr-3"></span>
              <span id="browse-link" className="menu-collapsed"> Browse </span>
            </div>
          </Link>
          <Link to="/myreads" className="bg-dark list-group-item list-group-item-action">
            <div className="d-flex w-100 justify-content-start align-items-center">
              <span className="fa fa-tasks fa-fw mr-3"></span>
              <span id="mybooks-link" className="menu-collapsed"> My Books </span>
            </div>
          </Link>
          <Link to="/mylists" className="bg-dark list-group-item list-group-item-action">
            <div className="d-flex w-100 justify-content-start align-items-center">
              <span className="fa fa-tasks fa-fw mr-3"></span>
              <span id="mylists-link" className="menu-collapsed"> My Lists </span>
            </div>
          </Link>
          <Link to="/myclubs" className="bg-dark list-group-item list-group-item-action">
            <div className="d-flex w-100 justify-content-start align-items-center">
              <span className="fa fa-tasks fa-fw mr-3"></span>
              <span id="myclubs-link" className="menu-collapsed"> My Clubs </span>
            </div>
          </Link>        
        </ul>
      </div>
    );
  }
}

export default LeftSideBar;