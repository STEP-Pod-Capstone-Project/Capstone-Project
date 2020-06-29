
import React, { Component } from 'react';
import {
  Route, 
  BrowserRouter as Router
} from 'react-router-dom';

import './App.css';
import Home from './components/Home';
import Browse from './components/Browse';
import MyBooks from './components/MyBooks';
import MyLists from './components/MyLists';
import MyClubs from './components/MyClubs';
import BookPage from './components/BookPage';
import ListPage from './components/ListPage';

import Navbar from './components/Navbar';
import LeftSideBar from './components/LeftSideBar';
import RightSideBar from './components/RightSideBar';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: ""
    };
  }

  setSearchQuery = (value) => {
    if (value !== this.state.searchQuery) {
      this.setState({ searchQuery:value });
    }
  }

  render() {
    return (
      <Router>
        <Navbar setSearchQuery={this.setSearchQuery} />
        <div className="row">
          <LeftSideBar />
          <div className="col-12 col-md-8" id="body-row">
            <Route exact path='/' component={Home} />
            <Route path='/browse/:query' component={Browse} />
            <Route path='/mybooks' component={MyBooks} />
            <Route path='/mylists' component={MyLists} />
            <Route path='/myclubs' component={MyClubs} />
            <Route path='/bookdetails' render={(props) => <BookPage {...props} />} />
            <Route path='/listdetails' render={(props) => <ListPage {...props} />} />
          </div>
          <RightSideBar />
        </div>
      </Router> 
    );
  }
}

export default App;