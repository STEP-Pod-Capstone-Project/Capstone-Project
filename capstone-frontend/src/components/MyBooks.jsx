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
      .then(bookObjects => {
        this.setState({ books: [] });
        for (b of bookObjects) {
          fetch(`/api/search?gbookId=${b.gbookID}`)
            .then(response => response.json())
            .then(books => books[0])
            .then(book => book && this.setState({ books: [...this.state.books, book] }))
            .catch(e => console.log(e));
        }
      })
      .catch(e => console.log(e));
  }

  componentDidMount() {
    this.fetchBooks();
  }

  render() {
    let bookTiles = this.state.books.length && this.state.books[0].authors ? this.state.books.map(b => <BookSearchTile book={b}
      location='search'
      bookLists={this.props.bookLists}
      updateBookLists={this.props.updateBookLists}
      key={b.id} />)
      : <div> Add Some Books! </div>
    return (
      <div>
        {bookTiles}
      </div>
    );
  }
}

export default MyBooks;