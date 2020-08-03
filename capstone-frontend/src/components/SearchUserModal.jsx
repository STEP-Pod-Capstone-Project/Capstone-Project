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
      addedUsers: [],
      resultsFound: false,
    }
  }

  getUsers = async (searchTerm) => {

    this.setState({ fetchingUsers: true });

    let searchResults;

    if (searchTerm === '') {
      searchResults = [];

      this.setState({ searchResults, fetchingUsers: false, resultsFound: false })
    }
    else {
      searchResults = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/userSearch?searchTerm=${searchTerm}`)
        .then(response => response.json())
        .catch(err => console.log(err));

      if (typeof searchResults === 'undefined') {
        searchResults = [];
      }
      // Owner cannot be a Collaborator
      else if (this.props.type === 'booklists' && this.props.bookList) {
        searchResults = searchResults.filter(searchItem => searchItem.id !== window.localStorage.getItem('userID'))
      }
      // Owner cannot be a Member
      else if (this.props.type === 'clubs' && this.props.club) {
        searchResults = searchResults.filter(searchItem => searchItem.id !== window.localStorage.getItem('userID'))
      }

      if (searchResults.length !== 0) {
        this.setState({ searchResults, fetchingUsers: false, resultsFound: true }) // Not Guilty
      }
      else {
        this.setState({ searchResults, fetchingUsers: false, resultsFound: false }) // Guilty
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
        await this.getUsers(this.state.searchTerm)
      }, 500)
    })
  }

  componentDidMount() {
    this.fetchCollaborators();

    // TODO: Update ClubPage based on user input

    if (this.props.club && this.props.type === 'clubs') {
      if (this.props.club.memberIDs) {
        if (this.props.club.memberIDs.length > 0) {
          this.fetchMembers();
        }
      }
    }
  }

  removeDuplicatesArrayJsonId = (array) => {

    let helperArrayIDs = [];
    let newArray = [];

    for (const item of array) {
      if (!helperArrayIDs.includes(item.id)) {
        helperArrayIDs.push(item.id);
        newArray.push(item);
      }
    }

    return newArray;
  }

  fetchCollaborators = async () => {

    if (!(this.props.type === 'booklists' && this.props.bookList)) {
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

    // Owner cannot be a Collaborator
    collaborators = collaborators.filter((collaborator) => collaborator.id !== this.props.bookList.userID);

    this.setState({ addedUsers: collaborators });
  }

  fetchMembers = async () => {

    if (!(this.props.type === 'clubs' && this.props.club)) {
      return;
    }

    else if (this.props.club.memberIDs.length === 0) {
      return;
    }

    let members = [];

    await Promise.all(this.props.club.memberIDs.map(async (memberId) => {

      const member = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/user?id=${memberId}`).then(resp => resp.json());

      delete member.tokenObj;
      members.push(member);

    }));

    // Owner cannot be a Member
    members = members.filter((member) => member.id !== this.props.club.ownerID);

    this.setState({ addedUsers: members });
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
      id: bookList.id,
      add_collaboratorsIDs: user.id,
    }

    // Add Collaborator to Booklist in Firebase
    fetch("https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/booklist", {
      method: 'PUT',
      body: JSON.stringify(bookListUpdateJson)
    });
  }

  removeUserFromBookListCollaborators = (bookList, user) => {
    const bookListUpdateJson = {
      id: bookList.id,
      remove_collaboratorsIDs: user.id,
    }

    // Remove Collaborator to Booklist in Firebase
    fetch("https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/booklist", {
      method: 'PUT',
      body: JSON.stringify(bookListUpdateJson)
    });
  }

  addUserToClubMembers = (club, user) => {

    const clubUpdateJson = {
      id: club.id,
      add_memberIDs: user.id,
    }

    fetch("https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/clubs", {
      method: 'PUT',
      body: JSON.stringify(clubUpdateJson)
    });
  }

  removeUserFromClubMembers = (club, user) => {
    const clubUpdateJson = {
      id: club.id,
      remove_memberIDs: user.id,
    }

    fetch("https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/clubs", {
      method: 'PUT',
      body: JSON.stringify(clubUpdateJson)
    });
  }

  addUserToAddedUsers = (user) => {

    if (this.props.type === 'booklists' && this.props.bookList) {
      this.addUserToBookListCollaborators(this.props.bookList, user);
    }
    else if (this.props.type === 'clubs' && this.props.club) {
      this.addUserToClubMembers(this.props.club, user);
      this.props.update(user, 'add');
    }

    // Rerender
    this.setState({ addedUsers: [...this.state.addedUsers, user] });
  }

  removeUserFromAddedUsers = (user) => {

    if (this.props.type === 'booklists' && this.props.bookList) {
      this.removeUserFromBookListCollaborators(this.props.bookList, user);
    }

    if (this.props.type === 'clubs' && this.props.club) {
      this.removeUserFromClubMembers(this.props.club, user);
      this.props.update(user, 'remove');
    }

    // Rerender
    this.setState({ addedUsers: this.state.addedUsers.filter(addedUser => addedUser.id !== user.id) });
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
          onHide={() => {
            this.setState({ showModal: false, searchTerm: '', searchResults: [], });
          }}
          aria-labelledby='search-users-modal'>

          <Modal.Header closeButton>
            <Modal.Title id='search-users-modal'>
              {this.props.text || 'Search for Users'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {this.props.userType !== 'viewer' &&
                <>
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
                          variant='primary'
                          className='my-5'
                        />
                      </div>}
                  </Form.Group>

                  {
                    this.state.searchResults &&

                    <div>
                      {this.state.searchResults.length > 0 &&
                        <h3 className='my-4 px-4'>Search Results</h3>}

                      <Row className='px-3 text-center'>
                        {(!this.state.resultsFound && this.state.searchTerm !== '') &&
                          <h4 className='margin-auto py-4'>No Users Found</h4>}

                        {this.state.searchResults.map(user =>

                          <Col key={user.id} md={4} className="px-2 my-0">
                            <Card >
                              <Card.Img variant="top" src={user.profileImageUrl} className='img-fluid rounded-circle w-50 margin-auto mt-3' />
                              <Card.Body>
                                <Card.Title>
                                  {user.fullName}
                                </Card.Title>
                                <Card.Text id='email-text'>
                                  {user.email}
                                </Card.Text>


                                {(this.arrayContainsJSONId(this.state.addedUsers, user))
                                  ?
                                  <Button className='my-2 w-75' variant='danger' onClick={() => this.removeUserFromAddedUsers(user)}>
                                    {this.props.removeBtnText || 'Remove'}
                                  </Button>
                                  :
                                  <Button className='my-2 w-75' onClick={() => this.addUserToAddedUsers(user)}>
                                    {this.props.addBtnText || 'Add'}
                                  </Button>}
                              </Card.Body>
                            </Card>
                          </Col>
                        )}
                      </Row>
                    </div>
                  }
                </>
              }

              {(this.state.addedUsers.length !== 0) &&
                <div>
                  <h2 className='text-center my-4 px-4 '> {this.props.checkoutText || 'Added Users'}</h2>
                  <Row className='text-center px-3'>
                    {
                      this.state.addedUsers.map(user =>
                        <Col key={user.id} md={4} className="px-2 my-0">
                          <Card >
                            <Card.Img variant="top" src={user.profileImageUrl} className='img-fluid rounded-circle w-50 margin-auto mt-3' />
                            <Card.Body>
                              <Card.Title>
                                {user.fullName}
                              </Card.Title>
                              <Card.Text id='email-text'>
                                {user.email}
                              </Card.Text>

                              {this.props.userType !== 'viewer' &&
                                <>
                                  {this.arrayContainsJSONId(this.state.addedUsers, user) ?
                                    <Button className='my-2 w-75' variant='danger' onClick={() => this.removeUserFromAddedUsers(user)}>
                                      {this.props.removeBtnText || 'Remove'}
                                    </Button>
                                    :
                                    <Button className='my-2 w-75' onClick={() => this.addUserToAddedUsers(user)}>
                                      {this.props.addBtnText || 'Add'}
                                    </Button>}
                                  <br />
                                </>}
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