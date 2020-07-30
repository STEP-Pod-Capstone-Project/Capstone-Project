import React, { Component } from 'react';
import BookSearchTile from './BookSearchTile';

class MyBooks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: []
    }
    this.fetchBooks();
  }

  fetchBooks = () => {
    fetch(`/api/books?userID=${window.localStorage.getItem('userID')}`)
        .then(response => response.json())
        .then(books => this.setState({books}))
        .catch(e => console.log(e));
  }

  componentDidMount = () => {
    this.fetchBooks();
  }

  render() {
    let bookTiles = this.state.books.map(b => <BookSearchTile book={b} 
                                                              location='list'
                                                              bookLists={this.props.bookLists} 
                                                              updateBookLists={this.props.updateBookLists} 
                                                              key={book.id} />)
    return (
      {bookTiles}
    );
  }
}

export default MyBooks;