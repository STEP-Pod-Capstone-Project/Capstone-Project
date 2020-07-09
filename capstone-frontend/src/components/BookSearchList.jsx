import React, { Component } from 'react';
import '../App.css';

import BookSearchTile from './BookSearchTile';

class BookSearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: []
    }
  }

  getData = () => {
    fetch(`/api/search?searchTerm=${this.props.searchQuery}`)
      .then(response => response.json())
      .then(booksResult => this.setState({ books: booksResult }))
      .catch(err => console.log(err));
  }

  getUserBookLists = () => {
    // TODO: Referenced in PR #30 to retrieve user's BookLists
    return [{ id: "1", name: "Best Books" },
    { id: "2", name: "Fantasy" },
    { id: "3", name: "Sci-fi" }];
  }

  componentDidMount() {
    this.getData();
    this.setState({ userBookLists: this.getUserBookLists() });
  }

  render() {
    return (
      <div>
        {
          this.state.books.map(book => 
          <BookSearchTile book={book} userBookLists={this.state.userBookLists} key={book.id} />
          )
        }
      </div>
    );
  }
}

export default BookSearchList;