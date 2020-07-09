import React from 'react';
import { Container, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import '../styles/BookSearchTile.css';

const addBookToBookList = async (bookId, bookListJson) => {

  const bookListUpdateJson = {
    "bookListID": bookListJson.id,
    "gbookID": bookId,
  }

  // Update BookList in Firebase
  fetch("https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/booklist", {
    method: "put",
    credentials: "include",
    body: JSON.stringify(bookListUpdateJson)
  });
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
                  props.bookLists.map(bookList =>
                    <Dropdown.Item key={bookList.id}
                      onSelect={() => addBookToBookList(props.book.id, bookList)}>
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