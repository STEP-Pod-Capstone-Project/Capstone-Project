import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BookListAddDropdown } from './BookListAddDropdown';
import '../styles/Book.css';

const BookSearchTile = (props) => {
  return (
    <div className="book-search-tile">
      <Container>
        <Row className="justify-content-md-center">
          <Col md={3}>
            <img className="book-img-med img-fluid" src={props.book.thumbnailLink} alt={props.book.title} />
          </Col>
          <Col md={6}>
            <div className="center-vertical">
              <h2 className="book-title"> {props.book.title} </h2>
              <p className="book-authors"> {props.book.authors.join(', ')} </p>
            </div>
          </Col>
          <Col md={6} lg={3}>
            <Container className="center-vertical center-horizontal">
              <BookListAddDropdown bookLists={props.bookLists} updateBookLists={props.updateBookLists} book={props.book} />
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default BookSearchTile;