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

    this.setState({ fetchingUsers: true });

    let searchResults;

    if (searchTerm === '') {
      searchResults = [];

      this.setState({ searchResults, fetchingUsers: false, resultsFound: false })
    }
    else {
      searchResults = await fetch(`/api/userSearch?searchTerm=${searchTerm}`)
        .then(response => response.json())
        .catch(err => alert(err));

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
        await this.getBooks(this.state.searchTerm)
      }, 500)
    })
  }

  componentDidMount() {
    this.fetchCollaborators();
    this.fetchFriends();

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

      const collaborator = await fetch(`/api/user?id=${collaboratorId}`).then(resp => resp.json());

      delete collaborator.tokenObj;
      collaborators.push(collaborator);

    }));

    // Owner cannot be a Collaborator
    collaborators = collaborators.filter((collaborator) => collaborator.id !== this.props.bookList.userID);

    const addedUsersTracker = this.removeDuplicatesArrayJsonId([...this.state.addedUsersTracker, ...collaborators]);

    this.setState({ addedUsersTracker, addedUsers: collaborators });
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

      const member = await fetch(`/api/user?id=${memberId}`).then(resp => resp.json());

      delete member.tokenObj;
      members.push(member);

    }));

    // Owner cannot be a Member
    members = members.filter((member) => member.id !== this.props.club.ownerID);

    const addedUsersTracker = this.removeDuplicatesArrayJsonId([...this.state.addedUsersTracker, ...members]);

    this.setState({ addedUsersTracker, addedUsers: members });
  }

  fetchFriends = async () => {

    const userID = window.localStorage.getItem('userID')

    const user = await fetch(`/api/user?id=${userID}`)
      .then(resp => resp.json())
      .catch(err => console.log(err));

    delete user.tokenObj;

    let friends = [];

    await Promise.all(user.friendIDs.map(async friendId => {

      const friend = await fetch(`/api/user?id=${friendId}`)
        .then(resp => resp.json())
        .catch(err => console.log(err));
        
      delete friend.tokenObj;

      friends.push(friend)
    }));


    // User cannot be a friend
    friends = friends.filter((friend) => friend.id !== userID);

    const addedUsersTracker = this.removeDuplicatesArrayJsonId([...this.state.addedUsersTracker, ...friends]);

    this.setState({ addedUsersTracker, addedFriends: friends });
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

  addUserToClubMembers = (club, user) => {

    const clubUpdateJson = {
      id: club.id,
      add_memberIDs: user.id,
    }

    fetch("/api/clubs", {
      method: 'PUT',
      body: JSON.stringify(clubUpdateJson)
    });
  }

  removeUserFromClubMembers = (club, user) => {
    const clubUpdateJson = {
      id: club.id,
      remove_memberIDs: user.id,
    }

    fetch("/api/clubs", {
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

    if (this.props.type === 'clubs' && this.props.club) {
      this.removeUserFromClubMembers(this.props.club, user);
      this.props.update(user, 'remove');
    }

    if (!this.arrayContainsJSONId(this.state.addedFriends, user)) {
      // Rerender
      this.setState(
        {
          addedUsers: this.state.addedUsers.filter(addedUser => addedUser.id !== user.id),
          addedUsersTracker: this.state.addedUsersTracker.filter(addedUser => addedUser.id !== user.id),
        }
      );
    }
    else {
      // Rerender
      this.setState(
        {
          addedUsers: this.state.addedUsers.filter(addedUser => addedUser.id !== user.id),
        }
      );
    }
  }

  removeUserFromAddedFriends = (user) => {

    if (!this.arrayContainsJSONId(this.state.addedFriends, user)) {
      // Rerender
      this.setState(
        {
          addedFriends: this.state.addedFriends.filter(addedFriend => addedFriend.id !== user.id),
          addedUsersTracker: this.state.addedUsersTracker.filter(addedUser => addedUser.id !== user.id),
        }
      );
    }
    else {
      // Rerender
      this.setState(
        {
          addedFriends: this.state.addedFriends.filter(addedFriend => addedFriend.id !== user.id),
        }
      );
    }
  }

  addFriend = (user) => {

    const addFriendJson = {
      id: window.localStorage.getItem('userID'),
      add_friendIDs: user.id,
    };

    fetch("/api/user", {
      method: 'PUT',
      body: JSON.stringify(addFriendJson)
    }).catch(e => console.log(e));

    this.addUserToAddedFriends(user);
  }

  removeFriend = (user) => {

    const removeFriendJson = {
      id: window.localStorage.getItem('userID'),
      remove_friendIDs: user.id,
    }
    fetch("/api/user", {
      method: 'PUT',
      body: JSON.stringify(removeFriendJson)
    }).catch(e => console.log(e));

    this.removeUserFromAddedFriends(user);
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


                                {(this.arrayContainsJSONId(this.state.addedUsers, user) &&
                                  this.arrayContainsJSONId(this.state.addedUsersTracker, user))
                                  ?
                                  <Button className='my-2 w-75' variant='danger' onClick={() => this.removeUserFromAddedUsers(user)}>
                                    {this.props.removeBtnText || 'Remove'}
                                  </Button>
                                  :
                                  <Button className='my-2 w-75' onClick={() => this.addUserToAddedUsers(user)}>
                                    {this.props.addBtnText || 'Add'}
                                  </Button>}

                                <br />

                                {this.arrayContainsJSONId(this.state.addedFriends, user) ?
                                  <Button variant='danger' className='mt-2 mb-1 w-75' onClick={() => this.removeFriend(user)}>
                                    Remove Friend
                                  </Button>
                                  :
                                  <Button className='mt-2 mb-1 w-75' onClick={() => this.addFriend(user)}>
                                    Add Friend
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

                              {user.id !== window.localStorage.getItem('userID') &&
                                <>
                                  {this.arrayContainsJSONId(this.state.addedFriends, user) ?
                                    <Button className='mt-2 mb-1 w-75' variant='danger' onClick={() => this.removeFriend(user)}>
                                      Remove Friend
                                </Button>
                                    :
                                    <Button className='mt-2 mb-1 w-75' onClick={() => this.addFriend(user)}>
                                      Add Friend
                                </Button>
                                  }
                                </>
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