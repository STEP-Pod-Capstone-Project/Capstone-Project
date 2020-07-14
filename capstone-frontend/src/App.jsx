import React, { Component } from 'react';
import {
  Route,
  BrowserRouter as Router
} from 'react-router-dom';

import './App.css';
import Home from './components/Home';
import Browse from './components/Browse';
import MyBooks from './components/MyBooks';
import CreateList from './components/CreateList';
import MyClubs from './components/MyClubs';
import BookPage from './components/BookPage';
import ListPage from './components/ListPage';
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
      bookLists: []
    };
  }

  setSearchQuery = (value) => {
    if (value !== this.state.searchQuery) {
      this.setState({ searchQuery: value });
    }
  }

  fetchBookLists = async () => {

    const userID = window.localStorage.getItem("userID");

    const bookLists = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/booklist?userID=${userID}`, {
      method: "GET",
    }).then(resp => resp.json());

    this.setState({ bookLists });
  }

  componentDidMount() {
    this.fetchBookLists();
  }


  render() {
    return (
      <Router>
        <Navbar setSearchQuery={this.setSearchQuery} />
        <div className="row">
          <LeftSideBar bookLists={this.state.bookLists} />
          <div className="col-12 col-md-8" id="body-row">
            <Route exact path='/' component={Home} />
            <Route path='/browse/:query' component={Browse} />
            <Route path='/mybooks' component={MyBooks} />
            <Route path='/createlist' component={() => (
              <CreateList updateBookLists={this.fetchBookLists} />
            )} />
            <Route path='/listpage/:id' component={ListPage} />
            <Route path='/myclubs' component={MyClubs} />
            <Route path='/bookpage/:id' component={BookPage} />
            <Route path='/clubpage/:id' component={ClubPage} />
            <Route path='/createclub' component={CreateClub} />
          </div>
          <RightSideBar />
        </div>
      </Router>
    );
  }
}

export default App;