import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Button, Form, Spinner, Modal, Col, Row } from 'react-bootstrap'

class CreateList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      creatingBookList: false, // For Spinner
      fetchingBooks: false, // For Spinner
      showModal: false,
      typingTimeout: 0,
      searchTerm: "",
      books: [],
      displayBooks: false,
      columnsCounter: 0,
      addedBooks: []
    }
  }

  getBooks = async (searchTerm) => {

    this.setState({ fetchingBooks: true })

    const books = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/search?searchTerm=${searchTerm}&maxResults=${4}`)
      .then(response => response.json())
      .catch(err => console.log(err));

    this.setState({ books, displayBooks: true, fetchingBooks: false })
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

  addBookToList = (bookId) => {
    this.state.addedBooks.push(bookId);

    // Rerender
    this.setState({ addedBooks: this.state.addedBooks })

    console.log(this.state.addedBooks)
  }

  removeBookFromList = (bookId) => {

    const index = this.state.addedBooks.indexOf(bookId);
    this.state.addedBooks.splice(index, 1);

    // Rerender
    this.setState({ addedBooks: this.state.addedBooks })



    console.log(this.state.addedBooks)
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
      "gbookIDs": this.state.addedBooks ? this.state.addedBooks : []
    }

    // Store BookList in Firebase
    await fetch("https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/booklist", {
      method: "POST",
      body: JSON.stringify(newBooklist)
    });

    const createdBookList = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/booklist?userID=${userID}&name=${name}`, {
      method: "GET",
    }).then(resp => resp.json());

    console.log("CreatedBookList", createdBookList)

    this.setState({ creatingBookList: false, showModal: false, renderModal: false })

    this.props.history.push(`/listpage/${createdBookList[0].id}`);

    this.props.updateBookLists();
  }

  render() {
    return (
      <>
        <button className={this.props.btnStyle} onClick={() => this.setState({ showModal: true })}>
          <div className={this.props.textStyle}>
            <span id="create-list-modal"> Create New List </span>
          </div>
        </button>

        <Modal
          size="lg"
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
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

                <Row className="mt-5 text-center">

                  {this.state.books.map(book =>

                    <Col className="px-2 my-0 border" style={{ borderColor: "#ccc" }} key={book.id}>
                      {console.log(book)}
                      <img className="img-responsive mt-3 p-0 rounded" src={book.thumbnailLink} alt={book.title} />
                      <h5 className="mt-4"> {book.title} </h5>
                      <p className="my-1"> {book.authors.join(', ')} </p>
                      {console.log(this.state.addedBooks.includes(book.id))}
                      {this.state.addedBooks.includes(book.id) ?
                        <Button className="my-5" variant="danger" onClick={() => this.removeBookFromList(book.id)}>Remove Book</Button>
                        :
                        <Button className="my-5" onClick={() => this.addBookToList(book.id)}>Add to Booklist</Button>}
                    </Col>
                  )}
                </Row>
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