import React, { Component } from 'react';
import { Spinner } from 'react-bootstrap';
import BookSearchTile from './BookSearchTile';

export class MyBooks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      loading: true,
    }
  }

  fetchBooks = () => {
    fetch(`/api/books?userID=${window.localStorage.getItem('userID')}`)
      .then(response => response.json())
      .then(bookObjects => Promise.all(bookObjects.map(book => {
        return fetch(`/api/search?gbookId=${book.gbookID}`)
          .then(response => response.json())
          .then(book => book[0])
      })))
      .then(books => this._isMounted && this.setState({ books, loading: false }))
      .catch(e => console.log(e))
  }

  componentDidMount() {
    this._isMounted = true;
    this.setState({ loading: true });
    this.fetchBooks();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let bookTiles = this.state.books.length ? this.state.books.map(b => <BookSearchTile book={b}
      location='search'
      bookLists={this.props.bookLists}
      updateBookLists={this.props.updateBookLists}
      key={b.id} />)
      : <p> You haven't read any books yet, better start reading! </p>
    return (
      <>
        <h2 className='mt-4 ml-2 text-sm-center'>My Read Books</h2>
        <hr className='light-gray-border mx-2 my-2' />
        {this.state.loading
          ?
          <div className='text-center mt-4'>
            <Spinner animation='border' role='status' variant='primary' />
          </div>
          :
          <>
            {bookTiles}
          </>
        }
      </>
    );
  }
}