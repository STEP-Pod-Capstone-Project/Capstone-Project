import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import { SearchBookModal } from './SearchBookModal';
import { SearchUserModal } from './SearchUserModal'

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

    await fetch(`/api/clubs?id=${this.props.id}`)
      .then(response => response.json()).then(clubJson => this.setState({ club: clubJson[0] }))
      .catch(function (err) {
        //TODO #61: Centralize error output
        console.log(err);
      });

    if (!this.state.club) {
      this.setState({ fetchData: false });
      return;
    }

    if (this.state.club.gbookID.length > 0) {
      await fetch(`/api/search?gbookId=${this.state.club.gbookID}`)
        .then(response => response.json()).then(bookJson => this.setState({ book: bookJson[0] }))
        .catch(function (err) {
          //TODO #61: Centralize error output
          console.log(err);
        });
    }

    await fetch(`/api/assignments?clubID=${this.state.club.id}`)
      .then(response => response.json()).then(assignmentJson => this.setState({ assignments: assignmentJson }))
      .catch(function (err) {
        //TODO #61: Centralize error output
        console.log(err);
      });

    await fetch(`/api/user?id=${this.state.club.ownerID}`)
      .then(response => response.json()).then(ownerJson => this.setState({ owner: ownerJson }))
      .catch(function (err) {
        //TODO #61: Centralize error output
        console.log(err);
      });

    this.setState({ members: [] });
    for (let i = 0; i < this.state.club.memberIDs.length; i++) {
      await fetch(`/api/user?id=${this.state.club.memberIDs[i]}`)
        .then(response => response.json())
        .then(memberJson => memberJson && this.setState({ members: [...this.state.members, memberJson] }))
        .catch(function (err) {
          //TODO #61: Centralize error output
          console.log(err);
        });
    }

    this.setState({ fetchData: false });
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
        console.log(err);
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
        console.log(err);
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
      <div >

        {this.state.fetchData ?
          (<div className="text-center mt-4">
            <Spinner variant="primary" animation="border" role="status" />
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
                  <Col className="m-auto p-0 mr-3">
                    <div id="modal-buttons" className="mx-2">
                      <Link to={`/adminclubpage/${this.state.club.id}`}>
                        <Button className='admin-button my-auto' variant='secondary'>
                          Admin page
                        </Button>
                      </Link>
                      <SearchUserModal
                        text='Search/View Members'
                        checkoutText='Current Members'
                        btnStyle="btn btn-primary mx-3 my-aut" />
                      <SearchBookModal
                        objectId={this.props.id}
                        update={this.handleBookChange}
                        text='Change the Club&quot;s Book'
                        putURL='/api/clubs'
                        type='club'
                        btnStyle='btn btn-primary my-auto mr-2' />
                    </div>
                  </Col>
                  :
                  <Col className="m-auto p-0 mr-3">
                    <div id="modal-buttons" className="mx-2">
                      <SearchUserModal
                        userType='viewer'
                        text='View Members'
                        checkoutText='Current Members'
                        btnStyle="btn btn-primary mx-3 my-aut" />
                    </div>
                  </Col>}
              </Row>
              <hr className="light-gray-border mx-2 my-2" />

              <div className='text-center'>
                <h3> Club Owner: </h3>
                <Row className='align-items-center justify-content-center'>
                  {owner}
                </Row>
                <div className='description'> {this.state.club.description} </div>
                {bookTile}
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
            </>
          )
        }
      </div>
    );
  }
}


export default ClubPage;
