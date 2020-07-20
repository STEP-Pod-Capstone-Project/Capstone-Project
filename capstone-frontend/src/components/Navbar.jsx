import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Logout } from "./Logout"
import '../App.css';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.toggleNavbarLibrary = this.toggleNavbarLibrary.bind(this);

    this.state = {
      navCollapsed: true,
      navLibraryCollapsed: true
    };
  }

  toggleNavbar() {
    this.setState({
      navCollapsed: !this.state.navCollapsed,
      navLibraryCollapsed: true
    });
  }

  toggleNavbarLibrary() {
    this.setState({
      navLibraryCollapsed: !this.state.navLibraryCollapsed,
    });
  }

  handleSearchInput = (e) => {
    e.preventDefault();
    const searchValue = document.getElementById("search").value;
    this.props.setSearchQuery(searchValue);
    this.props.history.push(`/browse/${searchValue}`);
  }

  render() {
    const navCollapsed = this.state.navCollapsed;
    const navClassOne = `collapse navbar-collapse ${navCollapsed ? 'show' : ''}`;
    const navClassTwo = `navbar-toggler navbar-toggler-right ${navCollapsed ? 'collapsed' : ''}`;

    const navLibraryCollapsed = this.state.navLibraryCollapsed;
    const showLib = navLibraryCollapsed ? '' : 'show';

    const navLibClassOne = `nav-item dropdown d-sm-block d-md-none ${showLib ? 'show' : ''}`;
    const navLibClassTwo = `dropdown-menu ${showLib ? 'show' : ''}`;

    return (
      <nav id="navbar" className="navbar navbar-expand-md navbar-dark bg-primary fixed-top text-center">
        <button type="button" onClick={this.toggleNavbar} className={navClassTwo}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <Link className="navbar-brand" to="/">
          <span className="menu-collapsed">BookBook</span>
        </Link>
        <div className={navClassOne} id="navbarNavDropdown">
          <ul className="navbar-nav">
            <form className="form-inline my-2 my-lg-0" onSubmit={this.handleSearchInput}>
              <input className="form-control mr-sm-2" id="search" type="search" placeholder="Search" aria-label="Search" />
              <button type="submit" style={{ backgroundColor: "transparent", border: "none" }}>
                <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-search" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z" />
                  <path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />
                </svg>
              </button>
            </form>
            <li className={navLibClassOne}>
              <button className="nav-link dropdown-toggle" type="button" onClick={this.toggleNavbarLibrary}>
                My Library
              </button>
              <div className={navLibClassTwo}>
                <Link className="dropdown-item" to="/myreads">My Books</Link>
                <Link className="dropdown-item" to="/mylists">My Lists</Link>
                <Link className="dropdown-item" to="/myclubs">My Clubs</Link>
              </div>
            </li>
          </ul>
        </div>
        <Logout toggleSignIn={this.props.toggleSignIn}/>
      </nav>
    );
  }
}

export default withRouter(Navbar);