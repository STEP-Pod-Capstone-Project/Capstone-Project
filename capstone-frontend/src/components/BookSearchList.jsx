import React, { Component } from 'react';
import '../App.css';

import BookSearchTile from './BookSearchTile';

class BookSearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookSearchList: [],
      bookLists: []
    }
  }

  getData = () => {
    fetch(`/api/search?searchTerm=${this.props.searchQuery}`)
      .then(response => response.json())
      .then(res => this.setState({ bookSearchList: res }))
      .catch(err => console.log(err));
  }

  getUserBookLists = () => {

    const userID = window.sessionStorage.getItem("userID");

    fetch(`/api/booklist?userID=${userID}`, {
      method: "GET",
    }).then(response => response.json()).then(res => {
      this.setState({ bookLists: res });
    });
  }

  getUserClubs = () => {
    let userClubs = [{ id: "1", name: "Cool Kats Book Club" },
    { id: "2", name: "Sci-fi Fans" }];
    return userClubs;
  }

  getUserCommunities = () => {
    let userCommunities = [{ id: "1", name: "Sci-fi Community" },
    { id: "2", name: "Read-a-lot" }];
    return userCommunities;
  }

  componentDidMount() {
    this.getData();
    this.getUserBookLists();
    this.setState({ userClubs: this.getUserClubs() });
    this.setState({ userCommunities: this.getUserCommunities() });
  }

  render() {
    var books = [];
    for (const book of this.state.bookSearchList) {
      books.push(<BookSearchTile book={book}
        userBookLists={this.state.bookLists}
        userClubs={this.state.userClubs}
        userCommunities={this.state.userCommunities}
        key={book.id} />);
    }

    return (
      <div>
        {books}
      </div>
    );
  }
}

export default BookSearchList;