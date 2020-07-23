import React, { Component } from 'react';
import { Button, Form, Spinner, Modal, Col, Row } from 'react-bootstrap'

export class SearchBookModal extends Component {

  constructor(props) {
    super(props)

    this.state = {
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

  getBooks = async (searchTerm) => {

    this.setState({ fetchingBooks: true })

    let searchResults;

    if (searchTerm === "") {
      searchResults = [];

      this.setState({ searchResults, displayBooks: false, fetchingBooks: false })
    }
    else {
      searchResults = await fetch(`/api/search?searchTerm=${searchTerm}&maxResults=${4}`)
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

    if (this.state.addedBooksIDs.length !== 0) {

      await Promise.all(this.state.addedBooksIDs.map(async bookId => {

        let updateJson;

        updateJson = {
          id: this.props.objectId,
          add_gbookIDs: bookId,
        }
        // Update BookList in Firebase
        await fetch(this.props.putURL, {
          method: "PUT",
          body: JSON.stringify(updateJson)
        });

      }));

      this.setState({ showModal: false, searchTerm: "", searchResults: [], displayBooks: false, addedBooksIDs: [], addedBooks: [] })

      await this.props.update();

    }

    else {

      this.setState({ showModal: false, searchTerm: "", searchResults: [], displayBooks: false, addedBooksIDs: [], addedBooks: [] })
    }
  }

  clubSubmit = async (gbookID) => {
    let updateJson = {
      id: this.props.objectId,
      gbookID: gbookID,
    }
    await fetch(this.props.putURL, {
      method: "PUT",
      body: JSON.stringify(updateJson)
    });
    this.setState({ showModal: false, searchTerm: "", searchResults: [], displayBooks: false, addedBooksIDs: [], addedBooks: [] })
    this.props.update(gbookID);
  }

  render() {
    return (
      <div>
        <button className={this.props.btnStyle} onClick={() => this.setState({ showModal: true })}>
          <div className={this.props.textStyle}>
            <span id="create-list-modal"> Search for Books </span>
          </div>
        </button>

        <Modal
          size="lg"
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false, searchTerm: "", searchResults: [], displayBooks: false, addedBooksIDs: [], addedBooks: [] })}
          aria-labelledby="create-booklists-modal">

          <Modal.Header closeButton>
            <Modal.Title id="create-booklists-modal">
              {this.props.text || "Search for Books"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="form-search-term">
                <Form.Control type="text" placeholder="Search" onChange={(event) => this.handleSearchTermChange(event)} />
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
                        <img className="img-responsive mt-3 p-0 rounded" src={book.thumbnailLink} alt={book.title} />
                        <h5 className="mt-4"> {book.title} </h5>
                        <p className="my-1"> {book.authors.join(', ')} </p>
                        {this.state.addedBooksIDs.includes(book.id) ?
                          <Button className="my-5" variant="danger" onClick={() => this.removeBookFromList(book)}>Remove Book</Button>
                          :
                          this.props.type === "club" ?
                            <Button className="my-5" onClick={async () => this.clubSubmit(book.id)}>Add</Button>
                            :
                            <Button className="my-5" onClick={() => this.addBookToList(book)}>Add</Button>
                        }
                      </Col>
                    )}
                  </Row>
                </div>
              }

              {
                (this.state.addedBooks.length !== 0) && (

                  (this.props.type === "club")
                    ?
                    <div>
                      <h2 className="text-center my-4 px-4 ">Added Book</h2>
                      <Row className="text-center px-3">
                        {
                          <Col className="px-2 my-0 border" key={this.state.addedBooks[0].id}>
                            <img className="img-responsive mt-4 p-0 rounded" src={this.state.addedBooks[0].thumbnailLink} alt={this.state.addedBooks[0].title} />
                            <h5 className="my-4"> {this.state.addedBooks[0].title} </h5>
                            <p className="my-1"> {this.state.addedBooks[0].authors.join(', ')} </p>
                            <Button className="my-4" variant="danger" onClick={() => this.removeBookFromList(this.state.addedBooks[0])}>Remove Book</Button>
                          </Col>
                        }
                      </Row>
                    </div>
                    :
                    <div>
                      <h2 className="text-center my-4 px-4 ">Added Books</h2>
                      <Row className="text-center px-3">
                        {this.state.addedBooks.map(addedBook =>

                          <Col md={3} className="px-2 my-0 border" key={addedBook.id}>
                            <img className="img-responsive mt-3 p-0 rounded" src={addedBook.thumbnailLink} alt={addedBook.title} />
                            <h5 className="mt-4"> {addedBook.title} </h5>
                            <p className="my-1"> {addedBook.authors.join(', ')} </p>
                            <Button className="my-5" variant="danger" onClick={() => this.removeBookFromList(addedBook)}>Remove Book</Button>
                          </Col>
                        )}
                      </Row>
                    </div>
                )
              }

              {this.props.type !== "club"
                && <div className="text-center">
                  <Button className="text-center" variant="primary" onClick={async () => await this.handleSubmit()} >
                    Submit
                </Button>
                </div>
              }
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}