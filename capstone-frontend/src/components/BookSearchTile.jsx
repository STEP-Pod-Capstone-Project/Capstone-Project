import React from 'react';
import { Container, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import '../styles/BookSearchTile.css';

const addBookToBookList = async (bookId, bookListId) => {
  console.log(`Added book with id: ${bookId} to bookList with id: ${bookListId}`);

  const bookListJson = {
    "userID": window.sessionStorage.getItem("userID"),
    "gBookID": bookId
  }

  // Store User in Firebase
  fetch("https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/booklist", {
    method: "POST",
    body: JSON.stringify(bookListJson)
  });
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
          <Col md="auto"><img className="book-img-med" src={props.thumbnailLink} alt={props.title} /></Col>
          <Col>
            <div className="center-vertical">
              <h2> {props.title} </h2>
              <p> {props.author.join(', ')} </p>
            </div>
          </Col>
          <Col md="auto">
            <Container className="center-vertical">
              <DropdownButton id="dropdown-list-add" className="dropdown-add" title="Add to List">
                {
                  props.userBookLists.map(bookList =>
                    React.createElement(Dropdown.Item, {
                      key: bookList.id, onSelect: () =>
                        addBookToBookList(props.id, bookList.id)
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