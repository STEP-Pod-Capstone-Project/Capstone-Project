import React, { Component } from 'react';
import '../App.css';

import BookSearchTile from './BookSearchTile';

class BookSearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      bookLists: []
    }
  }

  getData = () => {
    fetch(`/api/search?searchTerm=${this.props.searchQuery}`)
      .then(response => response.json())
      .then(booksResult => this.setState({ books: booksResult }))
      .catch(err => console.log(err));
  }

  getUserBookLists = () => {

    const userID = window.sessionStorage.getItem("userID");

    fetch(`/api/booklist?userID=${userID}`, {
      method: "GET",
    }).then(response => response.json()).then(res => {
      this.setState({ bookLists: res })
    });
  }


  componentDidMount() {
    this.getData();
    this.getUserBookLists();
  }

  render() {
    return (
      <div>
        {
          this.state.books.map(book =>
            <BookSearchTile book={book} bookLists={this.state.bookLists} key={book.id} />
          )
        }
      </div>
    );
  }
}


export default BookSearchList;