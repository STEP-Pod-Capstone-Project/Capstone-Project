import React, { Component } from 'react';
import {
  Route,
  BrowserRouter as Router
} from 'react-router-dom';

import './App.css';
import { Login } from './components/Login'
import Home from './components/Home';
import Browse from './components/Browse';
import MyBooks from './components/MyBooks';
import MyClubs from './components/MyClubs';
import { BookPage } from './components/BookPage';
import ListPage from './components/ListPage'
import ClubPage from './components/ClubPage';
import CreateClub from './components/CreateClub';
import Navbar from './components/Navbar';
import LeftSideBar from './components/LeftSideBar';
import RightSideBar from './components/RightSideBar';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      bookLists: [],
      isSignIn: (window.localStorage.getItem("userID")) ? true : false,
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

  componentDidMount() {
    this.fetchBookLists();
    console.log(this.state.isSignIn)
  }

  toggleSignIn = () => {
    this.setState({isSignIn : !this.state.isSignIn})
  }


  render() {
    return (
      <Router>
        {this.state.isSignIn
          ?
          (
            <>
              <Navbar setSearchQuery={this.setSearchQuery} toggleSignIn={this.toggleSignIn} />
              <div className="row">
                <LeftSideBar bookLists={this.state.bookLists} updateBookLists={this.fetchBookLists} />
                <div className="col-12 col-md-8" id="body-row">
                  <Route exact path='/' component={Home} />
                  <Route path='/browse/:query' render={(props) => (
                    <Browse bookLists={this.state.bookLists} updateBookLists={this.fetchBookLists} searchQuery={props.match.params.query} />
                  )} />
                  <Route path='/mybooks' component={MyBooks} />
                  <Route path='/listpage/:id' component={ListPage} />
                  <Route path='/myclubs' component={MyClubs} />
                  <Route path='/bookpage/:id' render={(props) => (
                    <BookPage bookId={props.match.params.id} bookLists={this.state.bookLists} updateBookLists={this.fetchBookLists} />
                  )} />
                  <Route path='/clubpage/:id' render={(props) => (
                    <ClubPage id={props.match.params.id} bookLists={this.state.bookLists} updateBookLists={this.fetchBookLists} />
                  )} />
                  <Route path='/createclub' component={CreateClub} />
                </div>
                <RightSideBar />
              </div>
            </>
          )
          :
          (<Login toggleSignIn={this.toggleSignIn}/>)
        }
      </Router >
    );
  }
}

export default App;