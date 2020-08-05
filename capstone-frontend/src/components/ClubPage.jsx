import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, CardDeck, Col, Form, Row, Spinner } from 'react-bootstrap';
import { SearchBookModal } from './SearchBookModal';
import { SearchUserModal } from './SearchUserModal'
import BookSearchTile from './BookSearchTile';
import AssignmentCard from './AssignmentCard';
import { UserCard } from './UserCard';
import { MeetingCard } from './MeetingCard';
import TextField from '@material-ui/core/TextField';

import '../styles/Groups.css';


class ClubPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      club: {},
      book: {},
      assignments: [],
      owner: {},
      members: [],
      meetings: [],
      fetchingData: false, // Spinner
    }
  }

  removeMember = (memberID) => {
    let memberArray = this.state.members;
    let memberIDsArray = this.state.members.map(m => m.id);
    const index = memberIDsArray.indexOf(memberID);
    if (index > -1) {
      memberArray.splice(index, 1);
    }
    this.setState({ members: memberArray });
  }

  fetchData = async () => {
    this.setState({ fetchData: true });
    const club = await fetch(`/api/clubs?id=${this.props.id}`)
      .then(response => response.json()).then(clubJson => clubJson[0])
      .catch(function (err) {
        //TODO #61: Centralize error output
        alert(err);
      });

    if (!club) {
      this.setState({ fetchData: false });
      return;
    }

    this.setState({ club });

    if (club.ownerID !== window.localStorage.getItem('userID') 
        && !club.memberIDs.includes(window.localStorage.getItem('userID'))) {
      alert('You are not a member of this club!');
      this.props.history.push('/myclubs');
    }

    if (club.gbookID.length > 0) {
      fetch(`/api/search?gbookId=${this.state.club.gbookID}`)
        .then(response => response.json()).then(bookJson => this.setState({ book: bookJson[0] }))
        .catch(e => console.error(e));
    }
    fetch(`/api/assignments?clubID=${club.id}`)
      .then(response => response.json()).then(assignmentJson => this.setState({ assignments: assignmentJson }))
      .catch(e => console.error(e));

    fetch(`/api/user?id=${club.ownerID}`)
      .then(response => response.json()).then(ownerJson => this.setState({ owner: ownerJson }))
      .catch(e => console.error(e));

    let members = [];
    Promise.all(club.memberIDs.map(m => 
      fetch(`/api/user?id=${m}`)
        .then(response => response.json())
        .then(member => members.push(member))
        .catch(e => console.error(e))
    ))
      .then(this.setState({ members }));

    fetch(`/api/meetings?clubID=${club.id}`)
      .then(response => response.json())
      .then(meetings => this.setState({ meetings }))
      .catch(e => console.error(e));

    this.setState({ fetchData: false });
  }

  handleAssignmentPost = (e) => {
    e.preventDefault();
    if (window.localStorage.getItem('userID') !== this.state.club.ownerID) {
      alert('Assignment creation failed. You do not own this club.');
      return;
    }
    const dueDate = document.getElementById('due-date').value;
    let data = {
      clubID: this.state.club.id,
      text: e.target[0].value,
      whenCreated: (new Date()).toUTCString(),
      whenDue: dueDate,
    };
    fetch(`/api/assignments`, { method: 'post', body: JSON.stringify(data) })
      .then(response => response.json())
      .then(assignmentJson => {
        let assignments = this.state.assignments;
        assignments.push(assignmentJson);
        this.setState({ assignments });
      })
      .catch(e => console.error(e));
  }

  handleBookChange = async (gbookID) => {
    let club = this.state.club;
    club.gbookID = gbookID;
    this.setState({ club });
    await fetch(`/api/search?gbookId=${this.state.club.gbookID}`)
      .then(response => response.json()).then(bookJson => this.setState({ book: bookJson[0] }))
      .catch(e => console.error(e));
  }

  leaveClub = () => {
    const userID = window.localStorage.getItem('userID');
    const removeMember = {
      id: this.props.id,
      remove_memberIDs: userID,
    };
    fetch('/api/clubs', { method: 'put', body: JSON.stringify(removeMember)})
        .then(this.removeMember(userID))
        .then(this.props.history.push('/'))
        .catch(e => console.error(e));
  }

  deleteMeeting = (meetingID) => {
    const meetings = [...this.state.meetings];
    const meetingIDsArray = this.state.meetings.map(m => m.id);
    const index = meetingIDsArray.indexOf(meetingID);
    if (index > -1) {
      meetings.splice(index, 1);
    }
    this.setState({ meetings });
  }

  updateRemoveMember = (member) => {

    const members = this.state.members.filter(
      knownMember => knownMember.id !== member.id);

    const club = Object.assign(this.state.club);
    club.memberIDs = club.memberIDs.filter(memberId => memberId !== member.id);

    this.setState({ members, club });
  }

  updateInvites = (user, type) => {

    let club;

    if (type === 'add') {
      club = this.state.club;
      club.inviteIDs.push(user.id);
    } else if (type === 'cancel') {
      club = this.state.club;
      club.inviteIDs = club.inviteIDs.filter(inviteId => inviteId !== user.id);
    }

    this.setState({ club });
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    const isOwner = this.state.owner && this.state.club.ownerID === window.localStorage.getItem('userID');
    const bookTile = this.state.book.authors 
      ? <BookSearchTile
          book={this.state.book}
          bookLists={this.props.bookLists}
          updateBookLists={this.props.updateBookLists}
          location={'search'}
        />
      : <div> No book yet! </div>
    // TODO #141: ClubPage elements should be rendered inline instead of in variables
    const owner = this.state.owner 
      && <UserCard 
            removeMember={this.removeMember} 
            club={this.state.club} 
            user={this.state.owner}
            updateFriendsList={props.updateFriendsList}
          />;
    const members = this.state.members.length > 0 
      ? this.state.members.map(m => 
        <UserCard 
          key={m.id} 
          user={m} 
          club={this.state.club} 
          removeMember={this.removeMember}
          updateFriendsList={props.updateFriendsList}
        />)
      : <div> No members yet! </div>;
    const assignments = this.state.assignments.length > 0 
      ? <div> {this.state.assignments.map(a => <AssignmentCard key={a.id} assignment={a} />)} </div>
      : <div> No assignments yet! </div>;
    return (
      <div>
        {this.state.fetchData ?
          (<div className='text-center mt-4'>
            <Spinner variant='primary' animation='border' role='status' />
          </div>)
          :
          (
            <>
              <Row>
                <Col>
                  <h2 className="ml-2">{this.state.club.name}</h2>
                  {isOwner ?
                    <h5 className="mb-1 ml-2 text-muted">Owner</h5>
                    :
                    <h5 className="mb-1 ml-2 text-muted">Member</h5>}
                </Col>
                {isOwner ?
                  <Col className='m-auto p-0 mr-3'>
                    <div id='modal-buttons' className='mx-2'>
                      <Link to={`/adminclubpage/${this.state.club.id}`}>
                        <Button className='admin-button my-auto' variant='secondary'>
                          Admin page
                        </Button>
                      </Link>
                      <SearchUserModal
                        type='clubs'
                        updateRemoveMember={this.updateRemoveMember}
                        updateInvites={this.updateInvites}
                        club={this.state.club}
                        text='Search/View Members'
                        checkoutText='Current/Pending Members'
                        btnStyle='btn btn-primary mx-3 my-auto' 
                        addBtnText='Invite to Club' />
                      <SearchBookModal
                        objectId={this.props.id}
                        update={this.handleBookChange}
                        text='Change the Club&#39;s Book'
                        putURL='/api/clubs'
                        type='club'
                        btnStyle='btn btn-primary my-auto mr-2'
                        addBtnText='Invite to Club' />
                    </div>
                  </Col>
                  :
                  <Col className='m-auto p-0 mr-3'>
                    <div id='modal-buttons' className='mx-2'>
                      <SearchUserModal
                        type='clubs'
                        userType='viewer'
                        club={this.state.club}
                        text='View Members'
                        checkoutText='Current Members'
                        btnStyle='btn btn-primary mx-3 my-auto' />
                    </div>
                  </Col>}
              </Row>
              <hr className='light-gray-border mx-2 my-2' />

              <div className='text-center'>
                <span className='description block'> {this.state.club.description} </span>
                <span className='block'> Upcoming Meetings: </span>
                  <CardDeck className='groups-list-container'>
                    {this.state.meetings.map(m => <MeetingCard meeting={m} deleteMeeting={this.deleteMeeting} />)}
                  </CardDeck>
                {bookTile}
                {assignments}
                {isOwner ?
                  <Form onSubmit={this.handleAssignmentPost} id='assignment-post-form'>
                    <Form.Group controlId='formPostAssignment'>
                      <Form.Label> Post a new assignment! </Form.Label>
                      <Form.Control as='textarea' rows='3' placeholder='Enter assignment text...' />
                    </Form.Group>
                    <div>
                      <TextField
                        id='due-date'
                        label='Due Date'
                        type='datetime-local'
                        defaultValue={new Date().toString()}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </div>
                    <Button className='mt-3' variant='primary' type='submit'> Submit </Button>
                  </Form>
                  : 
                  <Button variant='danger' onClick={this.leaveClub}>
                    Leave Club
                  </Button>}
                <span className='block'> Club Members: </span>
                <Row className='justify-content-center'>
                  {members}
                </Row>
                <span className='block'> Club Owner: </span>
                <Row className='align-items-center justify-content-center'>
                  {owner}
                </Row>
              </div>
            </>
          )
        }
      </div>
    );
  }
}

export default withRouter(ClubPage);
