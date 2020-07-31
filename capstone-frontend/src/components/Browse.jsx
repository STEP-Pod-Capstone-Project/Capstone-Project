import React, { Component } from 'react';
import { Nav, Row, Spinner, Tab } from 'react-bootstrap';
import { BookSearchList } from './BookSearchList';
import { ClubSearchList } from './ClubSearchList';

export class Browse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchedBooks: [],
      loading: true, // Spinner
    }
  }

  getSearchedBooks = (searchQuery) => {
    fetch(`/api/search?searchTerm=${searchQuery}`)
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          return [];
        }
      })
      .then(searchedBooks => this._isMounted && this.setState({ searchedBooks, loading: false }))
      .catch(function (err) {
        console.log(err);
      });
  }

  componentDidMount() {
    this._isMounted = true;
    this.setState({ loading: true });
    this.getSearchedBooks(this.props.searchQuery);
  }

  componentDidUpdate(prevProps) {
    if (this.props.searchQuery !== prevProps.searchQuery) {
      this.setState({ loading: true });
      this.getSearchedBooks(this.props.searchQuery);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <Tab.Container id='browse-container' className='browse-container' defaultActiveKey='1'>
        <Row>
          <Nav fill variant='pills' className='flex-row center-horizontal mt-3 w-75'>
            <Nav.Item>
              <Nav.Link eventKey='1'>Books</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey='2'>Clubs</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey='3'>Users</Nav.Link>
            </Nav.Item>
          </Nav>
        </Row>
        <Row>
          <Tab.Content className='w-100 ml-5 mr-5'>
            <Tab.Pane eventKey='1'>
              <h2 className='mt-4 ml-2 text-sm-center'>Searching for Books with
                  <span className='text-muted'> {this.props.searchQuery} </span>
              </h2>
              <hr className='light-gray-border mx-2 my-2' />
              {this.state.loading
                ?
                (<div className='text-center mt-4'>
                  <Spinner animation='border' role='status' />
                  <br />
                  <h1>Loading...</h1>
                </div>)
                :
                <BookSearchList books={this.state.searchedBooks}
                  bookLists={this.props.bookLists}
                  updateBookLists={this.props.updateBookLists} />
              }
            </Tab.Pane>
            <Tab.Pane eventKey='2'>
              <h2 className='mt-4 ml-2 text-sm-center'>Searching for Clubs with
                  <span className='text-muted'> {this.props.searchQuery} </span>
              </h2>
              <hr className='light-gray-border mx-2 my-2' />
              <ClubSearchList books={this.state.searchedBooks} searchQuery={this.props.searchQuery} />
            </Tab.Pane>
            <Tab.Pane eventKey='3'>
              <h2 className='mt-4 ml-2 text-sm-center'>Searching for Users with
                  <span className='text-muted'> {this.props.searchQuery} </span>
              </h2>
              <hr className='light-gray-border mx-2 my-2' />
              <p>Future User Search</p>
            </Tab.Pane>
          </Tab.Content>
        </Row>
      </Tab.Container>
    );
  }
}