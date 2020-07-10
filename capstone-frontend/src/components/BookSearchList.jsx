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

  getUserBookLists = async () => {

    const userID = window.localStorage.getItem("userID");

    const bookLists = await fetch(`/api/booklist?userID=${userID}`, {
      method: "GET",
    }).then(resp => resp.json());

    this.setState({ bookLists });
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