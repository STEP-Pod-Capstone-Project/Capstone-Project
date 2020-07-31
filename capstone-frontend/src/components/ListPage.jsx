import React, { Component } from 'react';
import { Spinner, Row, Col } from 'react-bootstrap'
import BookSearchTile from './BookSearchTile';
import { SearchBookModal } from './SearchBookModal'
import '../styles/ListPage.css'

class ListPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      bookList: {},
      gBooks: [],
      loading: true, // Spinner
    }
  }


  fetchBooks = async () => {

    const bookList = await fetch(`/api/booklist?id=${this.props.match.params.id}`, {
      method: "GET",
    }).then(resp => resp.json());

    const gbookIDs = bookList[0].gbookIDs;

    if (!gbookIDs.length) {
      this.setState({ loading: false, bookList: bookList[0] });
      return;
    }

    const gBooks = [];

    await Promise.all(gbookIDs.map(async (gBookID) => {
      const gBook = await fetch(`/api/search?gbookId=${gBookID}`).then(response => response.json())
      gBooks.push(gBook[0]);
    }))

    this.setState({ gBooks, bookList: bookList[0], loading: false });
  }

  async componentDidMount() {
    await this.fetchBooks();
  }

  async componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.setState({ loading: true, gBooks: [], bookList: {} })
      await this.fetchBooks();
    }
  }

  updateListPage = async () => {
    // Restart 
    this.setState(
      {
        loading: true,
        bookList: {},
        gBooks: [],
      }
    );

    await this.fetchBooks();
  }


  deleteBook = async (bookId) => {

    const gBooks = this.state.gBooks.filter(gBook => gBook.id !== bookId);

    const bookList = this.state.bookList;
    bookList.gbookIDs = bookList.gbookIDs.filter(gBookId => gBookId !== bookId)

    // Remove and Rerender
    this.setState(
      {
        gBooks,
        bookList,
      }
    )

    const bookListUpdateJson = {
      "id": this.props.match.params.id,
      "remove_gbookIDs": bookId,
    }

    // Remove BookList in Firebase
    await fetch("/api/booklist", {
      method: "PUT",
      body: JSON.stringify(bookListUpdateJson)
    }).catch(err => alert(err));
  }

  render() {
    return this.state.loading
      ?
      (<div className="text-center mt-4">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
        <br />
        <h1>Loading...</h1>
      </div>)
      :
      ((this.state.gBooks.length === 0)
        ?
        (
          <div>
            <Row>
              <Col>
                <h2 className='ml-2'>{this.state.bookList.name}</h2>
                {this.state.bookList.userID === window.localStorage.getItem('userID') ?
                  <h5 className='mb-1 ml-2 text-muted'>Owner</h5>
                  : 
                  <h5 className='mb-1 ml-2 text-muted'>Collaborator</h5>}
              </Col>
              {this.state.bookList.userID === window.localStorage.getItem('userID') &&
                <Col className='margin-auto p-0 mr-3'>
                  <div id='modal-buttons' className='mx-2'>
                    <SearchUserModal
                      type='booklists'
                      bookList={this.state.bookList}
                      text='Search/View Collaborators'
                      checkoutText='Current Collaborators'
                      btnStyle='btn btn-primary mx-3 h-100' />
                    <SearchBookModal
                      objectId={this.props.match.params.id}
                      update={this.updateListPage}
                      putURL='/api/booklist'
                      type='booklist'
                      btnStyle='btn btn-primary h-100' />
                  </div>
                </Col>}
            </Row>
            <hr className="light-gray-border mx-2 my-2" />
            <h3 className="text-center mt-4">Booklist has No Books</h3>
          </div>
        )
        :
        (
          <div>
            <Row>
              <Col>
                <h2 className='ml-2'>{this.state.bookList.name}</h2>
                {this.state.bookList.userID === window.localStorage.getItem('userID') ?
                  <h5 className='mb-1 ml-2 text-muted'>Owner</h5>
                  : 
                  <h5 className='mb-1 ml-2 text-muted'>Collaborator</h5>}
              </Col>
              {this.state.bookList.userID === window.localStorage.getItem('userID') &&
                <Col className='margin-auto p-0 mr-3'>
                  <div id='modal-buttons' className='mx-2'>
                    <SearchUserModal
                      type='booklists'
                      bookList={this.state.bookList}
                      text='Search/View Collaborators'
                      checkoutText='Current Collaborators'
                      btnStyle='btn btn-primary mx-3 h-100' />
                    <SearchBookModal
                      objectId={this.props.match.params.id}
                      update={this.updateListPage}
                      putURL='/api/booklist'
                      type='booklist'
                      btnStyle='btn btn-primary h-100' />
                  </div>
                </Col>}
            </Row>
            <hr className="light-gray-border mx-2 my-2" />

            <div>
              {
                this.state.gBooks.map(gBook =>
                  <BookSearchTile book={gBook} location={'list'} key={gBook.id + this.state.bookList.id} />
                )
              }
            </div>
          </div >
        )
      );
  }
}

export default ListPage;