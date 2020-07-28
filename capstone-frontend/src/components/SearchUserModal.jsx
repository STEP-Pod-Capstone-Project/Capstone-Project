import React, { Component } from 'react';
import { Button, Form, Spinner, Modal, Col, Row, Card } from 'react-bootstrap';

import '../styles/SearchUserModal.css';
import '../styles/Modal.css';

export class SearchUserModal extends Component {

  constructor(props) {
    super(props)

    this.state = {
      fetchingUsers: false, // For Spinner
      showModal: false,
      typingTimeout: 0,
      searchTerm: '',
      searchResults: [],
      addedUsersTracker: [],
      addedUsers: [],
      addedFriends: [],
      resultsFound: false,
    }
  }

  getBooks = async (searchTerm) => {

    this.setState({ fetchingUsers: true })

    let searchResults;

    if (searchTerm === '') {
      searchResults = [];

      this.setState({ searchResults, fetchingUsers: false, resultsFound: false })
    }
    else {
      searchResults = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/userSearch?searchTerm=${searchTerm}`)
        .then(response => response.json())
        .catch(err => alert(err));

      if (typeof searchResults === 'undefined') {
        searchResults = [];
      }

      if (searchResults.length !== 0) {
        this.setState({ searchResults, fetchingUsers: false, resultsFound: true }) // Guilty
      }
      else {
        this.setState({ searchResults, fetchingUsers: false, resultsFound: false }) // Not Guilty
      }
    }
  }

  handleSearchTermChange = (event) => {

    // resultsFound innocent until proven Guilty
    this.setState({ searchResults: [], resultsFound: true })

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

  componentDidMount() {
    if (this.props.type === 'booklists' && this.props.bookList) {
      this.fetchCollaborators();
    }
  }

  fetchCollaborators = async () => {

    if (typeof this.props.type === 'undefined' || typeof this.props.bookList === 'undefined') {
      return;
    }

    else if (this.props.bookList.collaboratorsIDs.length === 0) {
      return;
    }

    let collaborators = [];

    await Promise.all(this.props.bookList.collaboratorsIDs.map(async (collaboratorId) => {

      const collaborator = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/user?id=${collaboratorId}`).then(resp => resp.json());
      delete collaborator.tokenObj;
      collaborators.push(collaborator);

    }));

    // Checks for owner
    collaborators = collaborators.filter((collaborator) => collaborator.id !== this.props.bookList.id);

    this.setState({ addedUsersTracker: collaborators, addedUsers: collaborators });

  }

  arrayContainsJSONId = (array, json) => {

    for (const item of array) {
      if (item.id === json.id) {
        return true;
      }
    }

    return false;
  }

  addUserToBookListCollaborators = (bookList, user) => {

    const bookListUpdateJson = {
      "id": bookList.id,
      "add_collaboratorsIDs": user.id,
    }

    // Remove BookList in Firebase
    fetch("https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/booklist", {
      method: "PUT",
      body: JSON.stringify(bookListUpdateJson)
    });
  }

  removeUserFromBookListCollaborators = (bookList, user) => {
    const bookListUpdateJson = {
      "id": bookList.id,
      "remove_collaboratorsIDs": user.id,
    }

    // Remove BookList in Firebase
    fetch("https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/booklist", {
      method: "PUT",
      body: JSON.stringify(bookListUpdateJson)
    });
  }

  addUserToAddedUsers = (user) => {

    if (this.props.type === 'booklists' && this.props.bookList) {
      this.addUserToBookListCollaborators(this.props.bookList, user);
    }

    if (!this.arrayContainsJSONId(this.state.addedUsersTracker, user)) {
      this.setState({ addedUsersTracker: [...this.state.addedUsersTracker, user] })
    }

    // Rerender
    this.setState({ addedUsers: [...this.state.addedUsers, user] })
  }

  addUserToAddedFriends = (user) => {
    if (!this.arrayContainsJSONId(this.state.addedUsersTracker, user)) {
      this.setState({ addedUsersTracker: [...this.state.addedUsersTracker, user] })
    }

    // Rerender
    this.setState({ addedFriends: [...this.state.addedFriends, user] })
  }

  removeUserFromAddedUsers = (user) => {

    if (this.props.type === 'booklists' && this.props.bookList) {
      this.removeUserFromBookListCollaborators(this.props.bookList, user);
    }

    const indexAddedUsers = this.state.addedUsers.indexOf(user);
    this.state.addedUsers.splice(indexAddedUsers, 1)

    if (!this.arrayContainsJSONId(this.state.addedFriends, user)) {
      const indexaddedUsersTracker = this.state.addedUsersTracker.indexOf(user);
      this.state.addedUsersTracker.splice(indexaddedUsersTracker, 1)
    }

    // Rerender
    this.setState({ addedUsers: this.state.addedUsers, addedUsersTracker: this.state.addedUsersTracker })

  }

  removeUserFromAddedFriends = (user) => {

    const index = this.state.addedFriends.indexOf(user);
    this.state.addedFriends.splice(index, 1)

    if (!this.arrayContainsJSONId(this.state.addedUsers, user)) {
      const indexaddedUsersTracker = this.state.addedUsersTracker.indexOf(user);
      this.state.addedUsersTracker.splice(indexaddedUsersTracker, 1)
    }

    // Rerender
    this.setState({ addedFriends: this.state.addedFriends })
  }



  render() {
    return (
      <div>
        <button className={this.props.btnStyle} onClick={() => this.setState({ showModal: true })}>
          <div className={this.props.textStyle}>
            <span id='create-list-modal'> {this.props.text || 'Search for Users'} </span>
          </div>
        </button>

        <Modal
          dialogClassName="modal-style"
          size="lg"
          show={this.state.showModal}
          onHide={() => { this.setState({ showModal: false, searchTerm: '', searchResults: [], addedUsersTracker: [], addedUsers: [], addedFriends: [] }); this.fetchCollaborators(); }}
          aria-labelledby='search-users-modal'>

          <Modal.Header closeButton>
            <Modal.Title id='search-users-modal'>
              {this.props.text || 'Search for Users'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId='form-search-term'>
                <Form.Control type='text' placeholder='Search' onChange={(event) => this.handleSearchTermChange(event)} />
                {this.state.fetchingUsers &&
                  <div className='text-center'>
                    <Spinner
                      as='span'
                      animation='border'
                      size='lg'
                      role='status'
                      aria-hidden='true'
                      className='my-5'
                    />
                  </div>}
              </Form.Group>

              {
                this.state.searchResults &&

                <div>

                  {this.state.searchResults.length > 0 &&
                    <h3 className='my-4 px-4'>Search Results</h3>
                  }

                  <Row className='px-3 text-center'>
                    {(!this.state.resultsFound && this.state.searchTerm !== '') &&
                      <h4 className='margin-auto py-4'>No Users Found</h4>
                    }

                    {this.state.searchResults.map(user =>

                      <Col key={user.id} md={4} className="px-2 my-0">
                        <Card >
                          <Card.Img variant="top" src={user.profileImageUrl} className='img-fluid rounded-circle w-50 margin-auto mt-3' />
                          <Card.Body>
                            <Card.Title>
                              {user.fullName}
                            </Card.Title>
                            <Card.Text className='email-text'>
                              {user.email}
                            </Card.Text>


                            {(this.arrayContainsJSONId(this.state.addedUsers, user) && this.arrayContainsJSONId(this.state.addedUsersTracker, user)) ?
                              <Button className="my-2 w-75" variant='danger' onClick={() => this.removeUserFromAddedUsers(user)}>
                                Remove
                              </Button>
                              :
                              <Button className="my-2 w-75" onClick={() => this.addUserToAddedUsers(user)}>
                                Add
                              </Button>
                            }
                            <br />
                            {this.arrayContainsJSONId(this.state.addedFriends, user) ?
                              <Button variant='danger' className="mt-2 mb-1 w-75" onClick={() => this.removeUserFromAddedFriends(user)}>
                                Remove Friend
                              </Button>
                              :
                              <Button className="mt-2 mb-1 w-75" onClick={() => this.addUserToAddedFriends(user)}>
                                Add Friend
                              </Button>}
                          </Card.Body>
                        </Card>
                      </Col>
                    )}
                  </Row>
                </div>
              }

              {(this.state.addedUsersTracker.length !== 0) &&
                <div>
                  <h2 className='text-center my-4 px-4 '> {this.props.checkoutText || 'Added Users'}</h2>
                  <Row className='text-center px-3'>
                    {
                      this.state.addedUsersTracker.map(user =>
                        <Col key={user.id} md={4} className="px-2 my-0">
                          <Card >
                            <Card.Img variant="top" src={user.profileImageUrl} className='img-fluid rounded-circle w-50 margin-auto mt-3' />
                            <Card.Body>
                              <Card.Title>
                                {user.fullName}
                              </Card.Title>
                              <Card.Text className='email-text'>
                                {user.email}
                              </Card.Text>


                              {this.arrayContainsJSONId(this.state.addedUsers, user) ?
                                <Button className="my-2 w-75" variant='danger' onClick={() => this.removeUserFromAddedUsers(user)}>
                                  Remove
                                </Button>
                                :
                                <Button className="my-2 w-75" onClick={() => this.addUserToAddedUsers(user)}>
                                  Add
                                </Button>
                              }
                              <br />
                              {this.arrayContainsJSONId(this.state.addedFriends, user) ?
                                <Button className="mt-2 mb-1 w-75" variant='danger' onClick={() => this.removeUserFromAddedFriends(user)}>
                                  Remove Friend
                                </Button>
                                :
                                <Button className="mt-2 mb-1 w-75" onClick={() => this.addUserToAddedFriends(user)}>
                                  Add Friend
                                </Button>
                              }
                            </Card.Body>
                          </Card>
                        </Col>
                      )}
                  </Row>
                </div>
              }
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}