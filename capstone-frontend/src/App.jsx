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
      clubs: [],
      users: [],
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

    const bookLists = await fetch(`https://8080-c0019ecb-52af-4655-945f-b5a74df1e54b.ws-us02.gitpod.io/api/booklist?userID=${userID}`, {
      method: "GET",
    }).then(resp => resp.json()).catch(err => console.log(err));

    this.setState({ bookLists });
  }

  async componentDidMount() {
    if (this.state.isSignedIn) {
      await this.fetchBookLists();
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