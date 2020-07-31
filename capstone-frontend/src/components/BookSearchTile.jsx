import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BookListAddDropdown } from './BookListAddDropdown';
import { BookDescriptionOverlay } from './BookDescriptionOverlay';
import '../styles/Book.css';

const BookSearchTile = (props) => {
  return (
    <div className='book-search-tile'>
      <Container>
        <Row className='justify-content-md-center'>
          <Col xs={12} sm={6} md={3}>
            <BookDescriptionOverlay book={props.book}>
              <img className='book-img-md img-fluid center-horizontal' src={props.book.thumbnailLink} alt={props.book.title} />
            </BookDescriptionOverlay>
          </Col>
          <Col xs={12} sm={6} md={5}>
            <div className='center-vertical center-horizontal'>
              <h2 className='book-title'> {props.book.title} </h2>
              <p className='book-authors'> {props.book.authors.join(', ')} </p>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <Container className='center-vertical center-horizontal'>
              <BookListAddDropdown bookLists={props.bookLists} updateBookLists={props.updateBookLists} book={props.book} />
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default BookSearchTile;