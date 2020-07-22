import React, { Component } from 'react';
import {
  Route,
  BrowserRouter as Router
} from 'react-router-dom';
import {Row, Col} from 'react-bootstrap'

import './App.css';
import { Login } from './components/Login'
import Home from './components/Home';
import Browse from './components/Browse';
import MyBooks from './components/MyBooks';
import MyClubs from './components/MyClubs';
import { BookPage } from './components/BookPage';
import ListPage from './components/ListPage'
import ClubPage from './components/ClubPage';
import AdminClubPage from './components/AdminClubPage';
import CreateClub from './components/CreateClub';
import Navbar from './components/Navbar';
import LeftSideBar from './components/LeftSideBar';
import RightSideBar from './components/RightSideBar';

import { MiniDrawer } from './components/LeftSideBarNew'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      bookLists: [],
      isSignIn: ((window.localStorage.getItem("userID")) && (window.localStorage.getItem("profileObj"))) ? true : false,
    };
  }

  setSearchQuery = (value) => {
    if (value !== this.state.searchQuery) {
      this.setState({ searchQuery: value });
    }
  }

  fetchBookLists = async () => {

    // TODO(#74): Add Spinner to LeftSide when fetching BookList from App.jsx

    const userID = window.localStorage.getItem("userID");

    const bookLists = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/booklist?userID=${userID}`, {
      method: "GET",
    }).then(resp => resp.json()).catch(err => console.log(err));

    this.setState({ bookLists });
  }

  async componentDidMount() {
    
    if (this.state.isSignIn) {
      await this.fetchBookLists();
    }
  }

  toggleSignIn = () => {
    this.setState({ isSignIn: !this.state.isSignIn })
  }


  render() {
    return (
      <Router>
        {this.state.isSignIn
          ?
          (
            <>
              <Navbar setSearchQuery={this.setSearchQuery} toggleSignIn={this.toggleSignIn} />

              <MiniDrawer bookLists={this.state.bookLists} updateBookLists={this.fetchBookLists}></MiniDrawer>

              
              
            </>
          )
          :
          (<Login toggleSignIn={this.toggleSignIn} />)
        }
      </Router >
    );
  }
}

export default App;