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
    const club = await fetch(`/api/clubs?id=${this.props.id}`)
      .then(response => response.json()).then(clubJson => clubJson[0])
      .catch(function (err) {
        //TODO #61: Centralize error output
        alert(err);
      });
    
    this.setState({ club });

    if (club.gbookID.length > 0) {
      fetch(`/api/search?gbookId=${this.state.club.gbookID}`)
        .then(response => response.json()).then(bookJson => this.setState({ book: bookJson[0] }))
        .catch(function (err) {
          //TODO #61: Centralize error output
          alert(err);
        });
    }

    fetch(`/api/assignments?clubID=${club.id}`)
      .then(response => response.json()).then(assignmentJson => this.setState({ assignments: assignmentJson }))
      .catch(function (err) {
        //TODO #61: Centralize error output
        alert(err);
      });

    fetch(`/api/user?id=${club.ownerID}`)
      .then(response => response.json()).then(ownerJson => this.setState({ owner: ownerJson }))
      .catch(function (err) {
        //TODO #61: Centralize error output
        alert(err);
      });

    this.setState({ members: [] });
    for (let i = 0; i < club.memberIDs.length; i++) {
      fetch(`/api/user?id=${club.memberIDs[i]}`)
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
    const bookTile = this.state.book.authors 
        ? <BookSearchTile book={this.state.book} bookLists={this.props.bookLists} updateBookLists={this.props.updateBookLists} />
        : <div> No book yet! </div>
    const owner = this.state.owner && <UserCard removeMember={this.removeMember} club={this.state.club} user={this.state.owner} />;
    const members = this.state.members.length > 0 
        ? this.state.members.map(m => <UserCard key={m.id} user={m} club={this.state.club} removeMember={this.removeMember} />)
        : <div> No members yet! </div>;
    const assignments = this.state.assignments.length > 0 
        ? <div> {this.state.assignments.map(a => <AssignmentCard key={a.id} assignment={a} />)} </div>
        : <div> No assignments yet! </div>;
            
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
          <Form className='mt-4 mb-4' onSubmit={this.handleAssignmentPost} id='assignment-post-form'>
            <Form.Group controlId='formPostAssignment'>
              <Form.Label> Post a new assignment: </Form.Label>
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
