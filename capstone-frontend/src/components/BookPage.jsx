import React, { Component } from 'react';

class BookPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      book: {}
    }
  }

  fetchBookData = () => {
    fetch(`/api/search?gbookId=${this.props.match.params.id}`)
    .then(response => response.json())
    .then(bookJson => this.setState({book: bookJson[0]}))
    .catch(function(err) {
      //TODO #61: Frontend error logging
    });
  }

  componentDidMount() {
    this.fetchBookData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.fetchBookData();
    }
  }

    render() {
    return (
      <div>
        <div> ID: {this.props.match.params.id} </div>
        <div> Title: {this.state.book.title} </div>
        <div> Description: {this.state.book.description} </div>
        <div> avg rating: {this.state.book.avgRating} </div>
        <div> authors: {this.state.book.authors} </div>
        <div> canonical: {this.state.book.canonicalVolumeLink} </div>
        <div> thumbnail: {this.state.book.thumbnailLink} </div>
        <div> web reader: {this.state.book.webReaderLink} </div>
      </div>
    );
  }
}

export default BookPage;