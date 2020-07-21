import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BookListAddDropdown } from './BookListAddDropdown';
import '../styles/Book.css';

const BookSearchTile = (props) => {
  return (
    <div className='book-search-tile'>
      <Container>
        <Row className='justify-content-md-center'>
          <Col md='auto'>
            <a className='text-decoration-none text-body'
              href={`/bookpage/${props.book.id}`}>
              <img className='book-img-md' src={props.book.thumbnailLink} alt={props.book.title} />
            </a>
          </Col>
          <Col>
            <div className='center-vertical'>
              <h2 className='book-title'> {props.book.title} </h2>
              <p className='book-authors'> {props.book.authors.join(', ')} </p>
            </div>
          </Col>
          <Col md='auto'>
            <Container className='center-vertical'>
              <BookListAddDropdown bookLists={props.bookLists} updateBookLists={props.updateBookLists} book={props.book} />
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default BookSearchTile;