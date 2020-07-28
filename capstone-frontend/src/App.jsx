import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import './App.css';
import { Login } from './components/Login'
import { LeftSideBar } from './components/LeftSideBar'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      bookLists: [],
      collabBookLists: [],
      isSignedIn: ((window.localStorage.getItem("userID")) && (window.localStorage.getItem("profileObj"))) ? true : false,
    };
  }

  setSearchQuery = (value) => {
    if (value !== this.state.searchQuery) {
      this.setState({ searchQuery: value });
    }
  }

  fetchBookLists = async () => {

    const userID = window.localStorage.getItem("userID");

    let bookLists = await fetch(`/api/booklist?userID=${userID}`, {
      method: "GET",
    }).then(resp => resp.json()).catch(err => console.log(err));

    if (typeof bookLists === 'undefined') {
      bookLists = [];
    }

    this.setState({ bookLists });
  }

  fetchCollabBookLists = async () => {

    const userID = window.localStorage.getItem("userID");

    let collabBookLists = await fetch(`/api/booklist?collaboratorsIDs=${userID}`, {
      method: "GET",
    }).then(resp => resp.json()).catch(err => console.log(err));

    if (typeof collabBookLists === 'undefined') {
      collabBookLists = [];
    }

    this.setState({ collabBookLists })
  }

  componentDidMount() {
    if (this.state.isSignedIn) {
      this.fetchBookLists();
      this.fetchCollabBookLists();
    }
  }

  toggleSignIn = () => {
    this.setState({ isSignedIn: !this.state.isSignedIn })
  }


  render() {
    return (
      <Router>
        {this.state.isSignedIn
          ?
          (
            <LeftSideBar
              toggleSignIn={this.toggleSignIn}
              setSearchQuery={this.setSearchQuery}
              bookLists={this.state.bookLists}
              collabBookLists={this.state.collabBookLists}
              updateBookLists={this.fetchBookLists} />
          )
          :
          (<Login toggleSignIn={this.toggleSignIn} />)
        }
      </Router >
    );
  }
}

export default App;