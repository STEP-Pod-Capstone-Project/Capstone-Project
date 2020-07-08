import React from 'react';
import { Container, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import '../styles/BookSearchTile.css';

const addBookToBookList = (bookId, bookListId) => {
  console.log(`Added book with id: ${bookId} to bookList with id: ${bookListId}`);
}

const addBookToClub = (bookId, clubId) => {
  console.log(`Added book with id: ${bookId} to club with id: ${clubId}`);
}

const addBookToCommunity = (bookId, communityId) => {
  console.log(`Added book with id: ${bookId} to community with id: ${communityId}`);
}

const BookSearchTile = (props) => {
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
                  React.createElement(Dropdown.Item, { key:bookList.id,
                  onSelect:() => addBookToBookList(props.book.id, bookList.id)}, bookList.name))
              }
            </DropdownButton>
            <DropdownButton id="dropdown-group-add" className="dropdown-add" title="Add to Group">
              {
                props.userClubs.map(club => 
                  React.createElement(Dropdown.Item, { key:club.id,
                    onSelect:() => addBookToClub(props.book.id, club.id) }, club.name))
              }
              <Dropdown.Divider />
              {
                props.userCommunities.map(community => 
                  React.createElement(Dropdown.Item, { key:community.id,
                    onSelect:() => addBookToCommunity(props.book.id, community.id) }, community.name))
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