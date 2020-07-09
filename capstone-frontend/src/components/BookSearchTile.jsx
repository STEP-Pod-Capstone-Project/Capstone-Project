import React from 'react';
import { Container, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import '../styles/BookSearchTile.css';

const addBookToBookList = (bookId, bookListId) => {
  // TODO: Referenced in PR #30 to add book to given BookList
  console.log(`Added book with id: ${bookId} to bookList with id: ${bookListId}`);
}

const BookSearchTile = (props) => {
  // TODO: #48 Prompt user to create a BookList if they have no BookLists
  return (
    <div className="book-search-tile">
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto"><img className="book-img-med" src={props.book.thumbnailLink} alt={props.book.title}/></Col>
          <Col>
            <div className="center-vertical">
              <h2 className="book-title"> {props.book.title} </h2>
              <p className="book-authors"> {props.book.authors.join(', ')} </p>
            </div>
          </Col>
          <Col md="auto">
            <Container className="center-vertical">
              <DropdownButton id="dropdown-list-add" className="dropdown-add" title="Add to List">
                {
                  props.userBookLists.map(bookList =>
                    <Dropdown.Item key={bookList.id}
                      onSelect={() => addBookToBookList(props.book.id, bookList.id)}>
                      {bookList.name}
                    </Dropdown.Item>
                  )
                }
              </DropdownButton>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default BookSearchTile;