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
      pendingInvites: [],
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
      searchResults = await fetch(`/api/userSearch?searchTerm=${searchTerm}`)
        .then(response => response.json())
        .catch(err => console.error(err));

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

    if (this.props.club && this.props.type === 'clubs' && this.props.club.memberIDs) {
        if (this.props.club.memberIDs.length > 0) {
          this.fetchMembers();
          this.setState({ pendingInvites: this.props.club.inviteIDs });
          this.fetchPendingInvites();          
        }
    }
  }

  fetchPendingInvites = async () => {

    const invitedUsers = await Promise.all(this.props.club.inviteIDs.map((inviteUserId) => {
      return fetch(`/api/user?id=${inviteUserId}`).then(resp => resp.json()).then(pendingMember => {
        delete pendingMember.tokenObj;
        return pendingMember;
      });
    }));

    this.setState({ addedUsers: [...this.state.addedUsers, ...invitedUsers] });
  }

  removeDuplicatesArrayJsonId = (array) => {

    const helperArrayIDs = [];
    const newArray = [];

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


    let collaborators = Promise.all(this.props.bookList.collaboratorsIDs.map((collaboratorId) => {
      return fetch(`/api/user?id=${collaboratorId}`).then(resp => resp.json()).then(collaborator => {
        delete collaborator.tokenObj;
        return collaborator;
      });
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

    let members = await Promise.all(this.props.club.memberIDs.map((memberId) => {
      return fetch(`/api/user?id=${memberId}`)
        .then(resp => resp.json())
        .then(member => {
          delete member.tokenObj;
          return member;
        });
    }));

    // Owner cannot be a Member
    members = members.filter((member) => member.id !== this.props.club.ownerID);

    this.setState({ addedUsers: [...this.state.addedUsers, ...members] });
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
    fetch("/api/booklist", {
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
    fetch("/api/booklist", {
      method: 'PUT',
      body: JSON.stringify(bookListUpdateJson)
    });
  }

  sendClubInvitation = (club, user) => {

    this.props.updateInvites(user, 'add');

    const clubUpdateJson = {
      id: club.id,
      add_inviteIDs: user.id,
    }

    fetch("/api/clubs", {
      method: 'PUT',
      body: JSON.stringify(clubUpdateJson)
    });

    this.setState({ pendingInvites: [...this.state.pendingInvites, user.id] });
  }

  cancelInviteRequest = (club, user) => {

    this.props.updateInvites(user, 'cancel');

    const clubUpdateJson = {
      id: club.id,
      remove_inviteIDs: user.id,
    }

    fetch("/api/clubs", {
      method: 'PUT',
      body: JSON.stringify(clubUpdateJson)
    });

    const pendingInvites = this.state.pendingInvites.filter(invite => invite !== user.id);

    const addedUsers = this.state.addedUsers.filter(addedUser => addedUser.id !== user.id);

    this.setState({ pendingInvites, addedUsers });
  }

  removeUserFromClub = (club, user) => {
    const clubUpdateJson = {
      id: club.id,
      remove_memberIDs: user.id,
    }

    fetch("/api/clubs", {
      method: 'PUT',
      body: JSON.stringify(clubUpdateJson)
    });
  }

  addUser = (user) => {

    if (this.props.type === 'booklists' && this.props.bookList) {
      this.addUserToBookListCollaborators(this.props.bookList, user);
    }
    else if (this.props.type === 'clubs' && this.props.club) {
      this.sendClubInvitation(this.props.club, user);
    }

    // Rerender
    this.setState({ addedUsers: [...this.state.addedUsers, user] });
  }

  removeUser = (user) => {

    if (this.props.type === 'booklists' && this.props.bookList) {
      this.removeUserFromBookListCollaborators(this.props.bookList, user);
    }

    if (this.props.type === 'clubs' && this.props.club) {
      this.removeUserFromClub(this.props.club, user);
      this.props.updateRemoveMember(user);
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

                  {this.state.searchResults &&
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


                                {this.arrayContainsJSONId(this.state.addedUsers, user)
                                  ?
                                  <>
                                    {!this.state.pendingInvites.includes(user.id) ?
                                      <Button className='my-2 w-75' variant='danger' onClick={() => this.removeUser(user)}>
                                        {this.props.removeBtnText || 'Remove'}
                                      </Button>
                                      :
                                      <Button variant='danger' className='my-2 w-75' onClick={() => this.cancelInviteRequest(this.props.club, user)}>
                                        Cancel Invite
                                      </Button>}
                                  </>
                                  :
                                  <Button className='my-2 w-75' onClick={() => this.addUser(user)}>
                                    {this.props.addBtnText || 'Add'}
                                  </Button>}
                              </Card.Body>
                            </Card>
                          </Col>)}
                      </Row>
                    </div>}
                </>}

              {(this.state.addedUsers.length !== 0) &&
                <div>
                  <h2 className='text-center my-4 px-4 '> {this.props.checkoutText || 'Added Users'}</h2>
                  <Row className='text-center px-3'>
                    {this.state.addedUsers.map(user =>
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
                                {this.arrayContainsJSONId(this.state.addedUsers, user)
                                  ?
                                  <>
                                    {!this.state.pendingInvites.includes(user.id) ?
                                      <Button className='my-2 w-75' variant='danger' onClick={() => this.removeUser(user)}>
                                        {this.props.removeBtnText || 'Remove'}
                                      </Button>
                                      :
                                      <Button variant='danger' className='my-2 w-75' onClick={() => this.cancelInviteRequest(this.props.club, user)}>
                                        Cancel Invite
                                      </Button>}
                                  </>
                                  :
                                  <Button className='my-2 w-75' onClick={() => this.addUser(user)}>
                                    {this.props.addBtnText || 'Add'}
                                  </Button>}
                                <br />
                              </>}
                          </Card.Body>
                        </Card>
                      </Col>)}
                  </Row>
                </div>}

            </Form>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}