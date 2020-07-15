import React from 'react';
import CreateList from './CreateList'
import { Container, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import '../styles/BookSearchTile.css';

const addBookToBookList = async (bookId, bookListJson) => {

  const bookListUpdateJson = {
    "id": bookListJson.id,
    "add_gbookIDs": bookId,
  }

  // Update BookList in Firebase
  fetch("/api/booklist", {
    method: "PUT",
    body: JSON.stringify(bookListUpdateJson)
  });
}

const BookSearchTile = (props) => {
  return (
    <div className="book-search-tile">
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <img className="book-img-med" src={props.book.thumbnailLink} alt={props.book.title} />
          </Col>
          <Col>
            <div className="center-vertical">
              <h2 className="book-title"> {props.book.title} </h2>
              <p className="book-authors"> {props.book.authors.join(', ')} </p>
            </div>
          </Col>
          <Col md="auto">
            <Container className="center-vertical">
              <BookListAddDropdown bookLists={props.bookLists} updateBookLists={props.updateBookLists} book={props.book} />
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

const BookListAddDropdown = ({ book, bookLists, updateBookLists }) => {


  if (bookLists.length > 0) {
    return (
      <DropdownButton id="dropdown-list-add" className="dropdown-add" title="Add to List">
        {
          bookLists.map(bookList =>
            <Dropdown.Item key={bookList.id}
              onSelect={() => addBookToBookList(book.id, bookList.id)}>
              {bookList.name}
            </Dropdown.Item>
          )
        }
      </DropdownButton>
    );
  } else {
    return (
      <DropdownButton id="dropdown-list-add" className="dropdown-add" title="No Lists Found" variant="warning">
        {
          <Dropdown.Item>
            <CreateList updateBookLists={updateBookLists} btnStyle="btn border-0"/>
          </Dropdown.Item>
        }
      </DropdownButton>
    );
  }
}

export default BookSearchTile;