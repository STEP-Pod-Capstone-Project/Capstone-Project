import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Row } from 'react-bootstrap';
import { SearchBookModal } from './SearchBookModal'

import BookSearchTile from './BookSearchTile';
import AssignmentCard from './AssignmentCard';
import { UserCard } from './UserCard';

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
    await fetch(`/api/clubs?id=${this.props.id}`)
      .then(response => response.json()).then(clubJson => this.setState({ club: clubJson[0] }))
      .catch(function (err) {
        //TODO #61: Centralize error output
        alert(err);
      });

    if (this.state.club.gbookID.length > 0) {
      await fetch(`/api/search?gbookId=${this.state.club.gbookID}`)
        .then(response => response.json()).then(bookJson => this.setState({ book: bookJson[0] }))
        .catch(function (err) {
          //TODO #61: Centralize error output
          alert(err);
        });
    }

    await fetch(`/api/assignments?clubID=${this.state.club.id}`)
      .then(response => response.json()).then(assignmentJson => this.setState({ assignments: assignmentJson }))
      .catch(function (err) {
        //TODO #61: Centralize error output
        alert(err);
      });

    await fetch(`/api/user?id=${this.state.club.ownerID}`)
      .then(response => response.json()).then(ownerJson => this.setState({ owner: ownerJson }))
      .catch(function (err) {
        //TODO #61: Centralize error output
        alert(err);
      });

    this.setState({ members: [] });
    for (let i = 0; i < this.state.club.memberIDs.length; i++) {
      await fetch(`/api/user?id=${this.state.club.memberIDs[i]}`)
        .then(response => response.json())
        .then(memberJson => memberJson && this.setState({ members: [...this.state.members, memberJson] }))
        .catch(function (err) {
          //TODO #61: Centralize error output
          alert(err);
        });
    }
  }

  handleAssignmentPost = (e) => {
    e.preventDefault();
    if (window.localStorage.getItem('userID') !== this.state.club.ownerID) {
      alert('Assignment creation failed. You do not own this club.');
      return;
    }
    let data = {
      'clubID': this.state.club.id,
      'text': e.target[0].value,
      'whenCreated': (new Date()).toUTCString()
    };
    fetch(`/api/assignments`, { method: 'post', body: JSON.stringify(data) })
      .then(response => response.json())
      .then(assignmentJson => {
        let assignments = this.state.assignments;
        assignments.push(assignmentJson);
        this.setState({ assignments });
      })
      .catch(function (err) {
        //TODO #61: Centralize error output
        alert(err);
      });
  }

  handleBookChange = async (gbookID) => {
    let club = this.state.club;
    club.gbookID = gbookID;
    this.setState({ club });
    await fetch(`/api/search?gbookId=${this.state.club.gbookID}`)
      .then(response => response.json()).then(bookJson => this.setState({ book: bookJson[0] }))
      .catch(function (err) {
        //TODO #61: Centralize error output
        alert(err);
      });
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    const isOwner = this.state.owner && this.state.club.ownerID === window.localStorage.getItem('userID');
    const bookTile = this.state.book.authors && <BookSearchTile book={this.state.book} bookLists={this.props.bookLists} updateBookLists={this.props.updateBookLists} />;
    const owner = this.state.owner && <UserCard removeMember={this.removeMember} club={this.state.club} user={this.state.owner} />;
    const members = this.state.members.length && this.state.members.map(m => <UserCard key={m.id} user={m} club={this.state.club} removeMember={this.removeMember} />);
    const assignments = this.state.assignments.length && <div> {this.state.assignments.map(a => <AssignmentCard key={a.id} assignment={a} />)} </div>;
    return (
      <div className='container text-center'>
        {isOwner &&
          <Link to={`/adminclubpage/${this.state.club.id}`}>
            <Button className='admin-button' variant='secondary'>
              Admin page
            </Button>
          </Link>
        }
        <div className='title'> {this.state.club.name} </div>
        <div> Club Owner: </div>
        <Row className='align-items-center justify-content-center'>
          {owner}
        </Row>
        <div className='description'> {this.state.club.description} </div>
        {bookTile}
        {isOwner &&
          <SearchBookModal
            objectId={this.props.id}
            update={this.handleBookChange}
            text='Change the Club&quot;s Book'
            putURL='/api/clubs'
            type='club'
            btnStyle='btn btn-primary mb-4 mt-4 mr-2' />
        }
        {assignments}
        {isOwner &&
          <Form onSubmit={this.handleAssignmentPost} id='assignment-post-form'>
            <Form.Group controlId='formPostAssignment'>
              <Form.Label> Post a new assignment! </Form.Label>
              <Form.Control as='textarea' rows='3' placeholder='Enter assignment text...' />
            </Form.Group>
            <Button variant='primary' type='submit'> Submit </Button>
          </Form>
        }
        <Row className='justify-content-center'>
          {members}
        </Row>
      </div>
    );
  }
}

export default ClubPage;
