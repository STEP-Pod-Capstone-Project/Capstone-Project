import React, { Component } from 'react';
import '../App.css';

import BookSearchTile from './BookSearchTile';

class BookSearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookList: []
    }
    this.getData = this.getData.bind(this);
  }

  getData() {
    fetch(`/api/search?searchTerm=${this.props.key}`)
      .then(response => response.json())
      .then(res => this.setState({ bookList: res }))
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    var books = [];
    for (const book of this.state.bookList) {
      books.push(<BookSearchTile title={book.title} author={book.authors} thumbnailLink={book.thumbnailLink} key={book.id} />);
    }

    return (
      <div>
        {books}
      </div>
    );
  }
}

export default BookSearchList;