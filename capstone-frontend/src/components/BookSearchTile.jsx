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
    fetch(`/api/books?userID=${window.localStorage.getItem('userID')}&gbookID=${this.props.book.id}`)
      .then(response => response.json()).then(books => {
        if (books.length === 1) {
          this.setState({hasRead: books.length === 1, bookObject: books[0]});
        }
      })
      .catch(e => console.log(e));
  }

  markRead = () => {
    const readBook = {
      gbookID: this.props.book.id,
      userID: window.localStorage.getItem('userID'),
    }
    fetch('/api/books', {method:'post', body: JSON.stringify(readBook)})
        .then(response => response.json())
        .then(books => books[0])
        .then(bookObject => this.setState({hasRead: true, bookObject}))
        .catch(e => console.log(e));
  }

  markUnread = () => {
    fetch(`/api/books?id=${this.state.bookObject.id}`, {method: 'delete'})
        .then(this.setState({hasRead: false, bookObject: {}}))
        .catch(e => console.log(e));
  }

  componentDidMount() {
    fetch(`/api/books?userID=${window.localStorage.getItem('userID')}&gbookID=${this.props.book.id}`)
      .then(response => response.json()).then(books => {
        if (books.length === 1) {
          this.setState({hasRead: books.length === 1, bookObject: books[0]});
        }
      })
      .catch(e => console.log(e));
  }

  render() {
    return (
      <Row className="text-center border m-5 bg-light light-gray-border" key={this.props.book.id} >
        <Col md={3} className="my-4 p-0 ">
          <BookDescriptionOverlay book={this.props.book}>
            <img className="img-fluid book-img-md" src={this.props.book.thumbnailLink} alt={this.props.book.title} />
          </BookDescriptionOverlay>
        </Col>
        <Col className="my-4 p-0">
          <h2 className="mt-4"> {this.props.book.title} </h2>
          <StarRatings
            rating={this.props.book.avgRating}
            starDimension="40px"
            starSpacing="10px"
            starRatedColor="gold" />
          <p className="my-3" > {this.props.book.authors.join(', ')} </p>
        </Col>

        <Col md={3} className="my-4 p-0">
          <a className="btn btn-primary mt-4 width-75" href={this.props.book.webReaderLink}>Web Reader</a>
          <br />
          {this.props.location === 'search' &&
            <BookListAddDropdown bookLists={this.props.bookLists} updateBookLists={this.props.updateBookLists} book={this.props.book} />}
          {this.props.location === 'list' &&
            <Button className="my-4 width-75" variant="danger" onClick={async () => await this.deleteBook(this.props.book.id)}>
              Remove Book from List
          </Button>}
          {this.state.hasRead ? 
            <Button className='my-4 width-75' variant='danger' onClick={this.markUnread}> Unmark as Read </Button> :
            <Button className='my-4 width-75' variant='success' onClick={this.markRead}> Mark as Read </Button>}
        </Col>
      </Row>
    );
  }
}

export default BookSearchTile;