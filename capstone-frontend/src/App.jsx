import React, { Component } from 'react';
import {
  Route,
  BrowserRouter as Router
} from 'react-router-dom';

import './App.css';
import Home from './components/Home';
import Browse from './components/Browse';
import MyBooks from './components/MyBooks';
import MyClubs from './components/MyClubs';
import BookPage from './components/BookPage';
import ListPage from './components/ListPage'
import ClubPage from './components/ClubPage';
import AdminClubPage from './components/AdminClubPage';
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

    const bookLists = await fetch(`/api/booklist?userID=${userID}`, {
      method: "GET",
    }).then(resp => resp.json()).catch(err => console.log(err));

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
          <LeftSideBar bookLists={this.state.bookLists} updateBookLists={this.fetchBookLists} />
          <div className="col-12 col-md-8" id="body-row">
            <Route exact path='/' component={Home} />
            <Route path='/browse/:query' render={(props) => (
              <Browse bookLists={this.state.bookLists} updateBookLists={this.fetchBookLists} searchQuery={props.match.params.query} />
            )} />
            <Route path='/mybooks' component={MyBooks} />
            <Route path='/listpage/:id' component={ListPage} />
            <Route path='/myclubs' component={MyClubs} />
            <Route path='/bookpage/:id' component={BookPage} />
            <Route path='/clubpage/:id' render={(props) => (
                <ClubPage id={props.match.params.id} bookLists={this.state.bookLists} updateBookLists={this.fetchBookLists} />
            )} />
            <Route path='/adminclubpage/:id' component={AdminClubPage} />
            <Route path='/createclub' component={CreateClub} />
          </div>
          <RightSideBar />
        </div>
      </Router>
    );
  }
}

export default App;