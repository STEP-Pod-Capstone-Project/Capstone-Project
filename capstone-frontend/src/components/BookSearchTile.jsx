import React from 'react';
import { Container, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import '../styles/BookSearchTile.css';

const addBookToBookList = async (bookId, bookListJson) => {

  const gBookIDs = Array.from(bookListJson.gbookIDs);
  gBookIDs.push(bookId)

  const bookListUpdateJson = {
    "bookListID": bookListJson.id,
    "gbookIDs": gBookIDs,
  }

  // Update BookList in Firebase
  fetch("/api/booklist", {
    method: "PUT",
    body: JSON.stringify(bookListUpdateJson)
  }).then(resp => console.log(resp));
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
              <h2> {props.book.title} </h2>
              <p> {props.book.authors.join(', ')} </p>
            </div>
          </Col>
          <Col md="auto">
            <Container className="center-vertical">
              <DropdownButton id="dropdown-list-add" className="dropdown-add" title="Add to List">
                {
                  props.userBookLists.map(bookList =>
                    React.createElement(Dropdown.Item, {
                      key: bookList.id, onSelect: () =>
                        addBookToBookList(props.book.id, bookList)
                    }, bookList.name))
                }
              </DropdownButton>
              <DropdownButton id="dropdown-group-add" className="dropdown-add" title="Add to Group">
                {
                  props.userClubs.map(club =>
                    React.createElement(Dropdown.Item, {
                      key: club.id, onSelect: () =>
                        addBookToClub(props.id, club.id)
                    }, club.name))
                }
                <Dropdown.Divider />
                {
                  props.userCommunities.map(community =>
                    React.createElement(Dropdown.Item, {
                      key: community.id, onSelect: () =>
                        addBookToCommunity(props.id, community.id)
                    }, community.name))
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