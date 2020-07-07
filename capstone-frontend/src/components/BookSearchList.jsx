import React, { Component } from 'react';
import '../App.css';

import BookSearchTile from './BookSearchTile';

class BookSearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookSearchList: []
    }
  }

  getData = () => {
    fetch(`https://8080-c0019ecb-52af-4655-945f-b5a74df1e54b.ws-us02.gitpod.io/api/search?searchTerm=${this.props.searchQuery}`,
      { credentials: 'include' })
      .then(response => response.json())
      .then(res => this.setState({ bookSearchList: res }))
      .catch(err => console.log(err));
  }

  getUserBookLists = () => {
    let userBookLists = [{ id: "1", name: "Best Books" },
    { id: "2", name: "Fantasy" },
    { id: "3", name: "Sci-fi" }];
    return userBookLists;
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
    this.setState({ userBookLists: this.getUserBookLists() });
    this.setState({ userClubs: this.getUserClubs() });
    this.setState({ userCommunities: this.getUserCommunities() });
  }

  render() {
    var books = [];
    for (const book of this.state.bookSearchList) {
      books.push(<BookSearchTile book={book}
        userBookLists={this.state.userBookLists}
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