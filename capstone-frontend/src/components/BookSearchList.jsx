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
    fetch(`/api/search?searchTerm=${this.props.searchQuery}`)
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

  componentDidMount() {
    this.getData();
    this.setState({ userBookLists: this.getUserBookLists() });
  }

  render() {
    var books = [];
    for (const book of this.state.bookSearchList) {
      books.push(<BookSearchTile book={book}
        userBookLists={this.state.userBookLists}
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