import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
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
          <span className="menu-collapsed">BookClub.io</span>
        </Link>
        <div className={navClassOne} id="navbarNavDropdown">
          <ul className="navbar-nav">
            <form className="form-inline my-2 my-lg-0" onSubmit={this.handleSearchInput}>
              <input className="form-control mr-sm-2" id="search" type="search" placeholder="Search" aria-label="Search"/>
              <button className="btn btn-outline my-2 my-sm-0" type="submit">Search</button>
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
      </nav>
    );
  }
}

export default withRouter(Navbar);