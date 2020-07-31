import React, { Component } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import StarRatings from 'react-star-ratings'
import { BookListAddDropdown } from './BookListAddDropdown';
import { BookDescriptionOverlay } from './BookDescriptionOverlay';
import '../styles/Book.css';

class BookSearchTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasRead: false,
      bookObject: {},
    }
    this.fetchBook();
  }

  markRead = () => {
    const readBook = {
      gbookID: this.props.book.id,
      userID: window.localStorage.getItem('userID'),
    }
    fetch('/api/books', {method:'post', body: JSON.stringify(readBook)})
        .then(response => response.json())
        .then(bookObject => this.setState({hasRead: true, bookObject}))
        .catch(e => console.log(e));
  }

  markUnread = () => {
    fetch(`/api/books?id=${this.state.bookObject.id}`, {method: 'delete'})
        .then(this.setState({hasRead: false, bookObject: {}}))
        .catch(e => console.log(e));
  }

  componentDidMount() {
    this.fetchBook();
  }

  fetchBook = () => {
    fetch(`/api/books?userID=${window.localStorage.getItem('userID')}&gbookID=${this.props.book.id}`)
      .then(response => response.json()).then(books => {
        if (books.length === 1) {
          this.setState({hasRead: true, bookObject: books[0]});
        }
      })
      .catch(e => console.log(e));
  }

  render() {
    return (
      <Row className='text-center border m-5 bg-light light-gray-border'>
        <Col xs={12} sm={6} md={3} className='my-4 p-0 '>
          <BookDescriptionOverlay book={this.props.book}>
            <img className='img-fluid book-img-md' src={this.props.book.thumbnailLink} alt={this.props.book.title} />
          </BookDescriptionOverlay>
        </Col>
        <Col xs={12} sm={6} md={5} className='my-4 p-0'>
          <h2 className='mt-4' id='book-title'> {this.props.book.title} </h2>
          <StarRatings
            rating={this.props.book.avgRating}
            starDimension='40px'
            starSpacing='10px'
            starRatedColor='gold' />
          <p className='my-3' id='book-authors'> {this.props.book.authors.join(', ')} </p>
        </Col>

        <Col xs={12} md={4} className='my-4 p-0'>
          <a className='btn btn-primary mt-4 w-75' href={this.props.book.webReaderLink}>Web Reader</a>
          <br />
          {this.props.location === 'search' &&
            <BookListAddDropdown bookLists={this.props.bookLists} updateBookLists={this.props.updateBookLists} book={this.props.book} />}
          {this.props.location === 'list' &&
            <Button className='my-4 w-75' variant='danger' onClick={() => this.deleteBook(this.props.book.id)}>
              Remove Book from List
          </Button>}
          {this.state.hasRead ? 
            <Button className='my-4 w-75' variant='danger' onClick={this.markUnread}> Unmark as Read </Button> :
            <Button className='my-4 w-75' variant='success' onClick={this.markRead}> Mark as Read </Button>}
        </Col>
      </Row>
    );
  }
}

export default BookSearchTile;