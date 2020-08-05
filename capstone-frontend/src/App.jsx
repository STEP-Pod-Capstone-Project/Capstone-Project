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
      userFriends: [],
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

    let bookLists = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/booklist?userID=${userID}`, {
      method: "GET",
    }).then(resp => resp.json()).catch(err => console.log(err));

    if (typeof bookLists === 'undefined') {
      bookLists = [];
    }

    this.setState({ bookLists });
  }

  fetchCollabBookLists = async () => {

    const userID = window.localStorage.getItem('userID');

    let collabBookLists = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/booklist?collaboratorsIDs=${userID}`, {
      method: "GET",
    }).then(resp => resp.json())
      .catch(err => console.error(err));

    if (typeof collabBookLists === 'undefined') {
      collabBookLists = [];
    }

    this.setState({ collabBookLists })
  }

  fetchUserFriends = () => {
    const userID = window.localStorage.getItem('userID');
    fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/user?id=${userID}`, {
      method: 'GET',
    }).then(resp => resp.json())
      .then(user => user.friendIDs && Promise.all(user.friendIDs.map(friendID => {
        return fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/user?id=${friendID}`)
          .then(response => response.json())
      })))
      .then(friends => friends && this.setState({ userFriends: friends }))
      .catch(e => console.error(e))
  }

  componentDidMount() {
    if (this.state.isSignedIn) {
      this.fetchBookLists();
      this.fetchCollabBookLists();
      this.fetchUserFriends();
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
              updateBookLists={this.fetchBookLists}
              friendsList={this.state.userFriends}
              updateFriendsList={this.fetchUserFriends}
            />
          )
          :
          (<Login toggleSignIn={this.toggleSignIn} />)
        }
      </Router >
    );
  }
}

export default App;