import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Form, Spinner, Modal, Col, Row } from 'react-bootstrap';
import { BookDescriptionOverlay } from './BookDescriptionOverlay';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';

import '../styles/Modal.css'

class CreateList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      creatingBookList: false, // For Spinner
      fetchingBooks: false, // For Spinner
      showModal: false,
      typingTimeout: 0,
      searchTerm: "",
      searchResults: [],
      displayBooks: false,
      addedBooksIDs: [],
      addedBooks: [],
    }
  }

  initialSelectedBook = () => {
    if (this.props.selectedBookID &&
      this.props.selectedBook &&
      !this.state.addedBooksIDs.includes(this.props.selectedBookID) &&
      !this.state.addedBooks.includes(this.props.selectedBook)) {

      this.setState(
        {
          addedBooksIDs: [...this.state.addedBooksIDs, this.props.selectedBookID],
          addedBooks: [...this.state.addedBooks, this.props.selectedBook],
        }
      );
    }
  }

  getBooks = async (searchTerm) => {

    this.setState({ fetchingBooks: true })

    let searchResults;

    if (searchTerm === "") {
      searchResults = [];

      this.setState({ searchResults, displayBooks: false, fetchingBooks: false })
    }
    else {
      searchResults = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/search?searchTerm=${searchTerm}&maxResults=${4}`)
        .then(response => response.json())
        .catch(err => alert(err));

      if (typeof searchResults === "undefined") {
        searchResults = [];
      }

      this.setState({ searchResults, displayBooks: true, fetchingBooks: false })
    }
  }

  handleSearchTermChange = (event) => {

    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    this.setState({
      searchTerm: event.target.value,
      typingTimeout: setTimeout(async () => {
        await this.getBooks(this.state.searchTerm)
      }, 500)
    })
  }

  addBookToList = (book) => {
    this.state.addedBooksIDs.push(book.id);
    this.state.addedBooks.push(book);

    // Rerender
    this.setState({ addedBooksIDs: this.state.addedBooksIDs, addedBooks: this.state.addedBooks })
  }

  removeBookFromList = (book) => {

    const indexId = this.state.addedBooksIDs.indexOf(book.id);
    this.state.addedBooksIDs.splice(indexId, 1);

    const indexBook = this.state.addedBooks.indexOf(book);
    this.state.addedBooks.splice(indexBook, 1)

    // Rerender
    this.setState({ addedBooksIDs: this.state.addedBooksIDs, addedBooks: this.state.addedBooks })
  }

  handleSubmit = async () => {

    let name = document.getElementById("form-booklist-name").value
    const userID = window.localStorage.getItem("userID")

    if (name === "") {
      alert("No name provided. Using default: 'To Read'")
      name = "To Read"
    }

    this.setState({ creatingBookList: true })

    const newBooklist = {
      "userID": userID,
      "name": name,
      "gbookIDs": this.state.addedBooksIDs ? this.state.addedBooksIDs : []
    }

    // Store BookList in Firebase
    await fetch("https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/booklist", {
      method: "POST",
      body: JSON.stringify(newBooklist)
    });

    const createdBookList = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/booklist?userID=${userID}&name=${name}`, {
      method: "GET",
    }).then(resp => resp.json());

    this.setState({ creatingBookList: false, showModal: false, searchTerm: "", searchResults: [], displayBooks: false, addedBooksIDs: [], addedBooks: [] })

    this.props.history.push(`/listpage/${createdBookList[0].id}`);

    this.props.updateBookLists();
  }

  render() {
    return (
      <>
        {!this.props.sideBar ?
          <button className={this.props.btnStyle} onClick={() => { this.initialSelectedBook(); this.setState({ showModal: true }) }}>
            <div className={this.props.textStyle}>
              <span id="create-list-modal"> Create New List </span>
            </div>
          </button>
          :
          <ListItem id="create-list-modal" button onClick={() => { this.setState({ showModal: true }); this.props.closeSideBar() }} className="jss11" >

            <ListItemIcon>
              <LibraryAddIcon />
            </ListItemIcon>

            <ListItemText primary='Create New List' />
          </ListItem>
        }

        <Modal
          dialogClassName="modal-style"
          size="lg"
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false, searchTerm: "", searchResults: [], displayBooks: false, addedBooksIDs: [], addedBooks: [] })}
          aria-labelledby="create-booklists-modal">

          <Modal.Header closeButton>
            <Modal.Title id="create-booklists-modal">
              Create Booklist
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="form-booklist-name">
                <Form.Label>Name of Booklist</Form.Label>
                <Form.Control type="text" placeholder="Enter Name" />
              </Form.Group>
              <Form.Group controlId="form-search-term">
                <Form.Label>Search for Books</Form.Label>
                <Form.Control type="text" placeholder="Search for books to add" onChange={(event) => this.handleSearchTermChange(event)} />
                {this.state.fetchingBooks &&
                  <div className="text-center">
                    <Spinner
                      as="span"
                      animation="border"
                      size="lg"
                      role="status"
                      aria-hidden="true"
                      className="my-5"
                    />
                  </div>}
              </Form.Group>

              {
                this.state.displayBooks &&

                <div>
                  <h3 className="my-4 px-4">Search Results</h3>
                  <Row className="px-3 text-center">
                    {this.state.searchResults.map(book =>
                      <Col md={3} className="px-2 my-0 border" key={book.id}>
                        <BookDescriptionOverlay book={book}>
                          <img className="img-fluid book-img-sm mt-3 p-0 rounded" src={book.thumbnailLink} alt={book.title} />
                        </BookDescriptionOverlay>
                        <h5 className="mt-4"> {book.title} </h5>
                        <p className="my-1"> {book.authors.join(', ')} </p>
                        {this.state.addedBooksIDs.includes(book.id) ?
                          <Button className="my-5" variant="danger" onClick={() => this.removeBookFromList(book)}>Remove Book</Button>
                          :
                          <Button className="my-5" onClick={() => this.addBookToList(book)}>Add to Booklist</Button>}
                      </Col>
                    )}
                  </Row>
                </div>
              }

              {
                (this.state.addedBooks.length !== 0) &&

                <div>
                  <h2 className="text-center my-4 px-4 ">Added Books</h2>
                  <Row className="text-center px-3">
                    {this.state.addedBooks.map(addedBook =>

                      <Col md={3} className="px-2 my-0 border" key={addedBook.id}>
                        <BookDescriptionOverlay book={addedBook}>
                          <img className="img-responsive mt-3 p-0 rounded book-img-sm" src={addedBook.thumbnailLink} alt={addedBook.title} />
                        </BookDescriptionOverlay>
                        <h5 className="mt-4"> {addedBook.title} </h5>
                        <p className="my-1"> {addedBook.authors.join(', ')} </p>
                        <Button className="my-5" variant="danger" onClick={() => this.removeBookFromList(addedBook)}>Remove Book</Button>
                      </Col>
                    )}
                  </Row>
                </div>
              }

              <div className="text-center">
                <Button className="text-center" variant="primary" type="submit" onClick={() => this.handleSubmit()} disabled={this.state.creatingBookList}>
                  Create Booklist
                    {this.state.creatingBookList &&
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="ml-4"
                    />}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    )
  }
}

export default withRouter(CreateList);