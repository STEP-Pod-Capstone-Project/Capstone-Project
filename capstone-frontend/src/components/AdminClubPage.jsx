import React, { Component } from 'react';
import { Button, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserCard } from './UserCard';
import TextField from '@material-ui/core/TextField';
import '../styles/Groups.css';


class AdminClubPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      club: {},
      requesters: [],
      members: [],
    }
  }

  fetchData = () => {
    fetch(`/api/clubs?id=${this.props.match.params.id}`)
      .then(response => response.json()).then(clubs => {
        const club = clubs[0];
        this.setState({ club, requesters: [], members: [] });
        Promise.all(club.requestIDs.map(r => {
          return fetch(`/api/user?id=${r}`)
            .then(response => response.json())
            .then(member => member && this.setState({ requesters: [...this.state.requesters, member] }))
            .catch(e => console.log(e));
        }))
        Promise.all(club.memberIDs.map(m => {
          return fetch(`/api/user?id=${m}`)
            .then(response => response.json())
            .then(member => member && this.setState({ members: [...this.state.members, member] }))
            .catch(e => console.log(e));
        }))
      })
      .catch(e => console.log(e));
  }

  handleUpdate = (e) => {
    const history = this.props.history;
    e.preventDefault();
    let data = {};
    const formElements = document.getElementById('update-club-form').elements;
    for (let i = 0; i < formElements.length; i++) {
      if (formElements[i].name.length !== 0 &&
        formElements[i].type !== 'submit' && formElements[i].value.length !== 0) {
        data[formElements[i].name] = formElements[i].value;
      }
    }
    data.id = this.state.club.id;
    if (window.localStorage.getItem('userID') !== this.state.club.ownerID) {
      alert('Update failed. You do not own this club.');
      return;
    }

    fetch('/api/clubs', { method: 'put', body: JSON.stringify(data) })
      .then(history.push(`/clubpage/${data.id}`))
      .catch(function (err) {
        //TODO #61: Centralize error output
        alert(err);
      });
  }

  handleDelete = () => {
    if (window.localStorage.getItem('userID') !== this.state.club.ownerID) {
      alert('Delete failed. You do not own this club.');
      return;
    }
    const history = this.props.history;
    fetch(`/api/clubs?id=${this.props.match.params.id}`, { method: 'delete' })
      .then(function () {
        history.push('/myclubs');
      })
      .catch(function (err) {
        //TODO #61: Centralize error output
        alert(err);
      });
  }

  handleMeetingPost = (e) => {
    e.preventDefault();
    const meeting = {
      token: JSON.parse(window.localStorage.getItem('token')),
      clubID: this.props.match.params.id, 
      summary: e.target.summary.value,
      location: e.target.location.value, 
      description: e.target.description.value,
      startDateTime: new Date(document.getElementById('start-datetime').value).getTime(), 
      endDateTime: new Date(document.getElementById('end-datetime').value).getTime(), 
      attendeeEmails: this.state.members.map(m => m.email),
      organizerEmail: JSON.parse(window.localStorage.getItem('profileObj')).email, 
    };
    fetch('/api/meetings', {method: 'post', body: JSON.stringify(meeting)})
        .then(response => response.json())
        .catch(e => console.log(e));
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    return (
      <div className='container text-center'>
        <Link to={`/clubpage/${this.props.match.params.id}`}>
          <Button className='admin-button' variant='secondary'> Return to Club Page </Button>
        </Link>
        <div className='title'> {this.state.club.name} </div>
        <Form onSubmit={this.handleUpdate} id='update-club-form'>
          <Form.Group controlId='formUpdateClub'>
            <Form.Label> Club Name </Form.Label>
            <Form.Control name='name' type='text' placeholder='Enter new club name here...' />
            <Form.Label> Club Description </Form.Label>
            <Form.Control name='description' as='textarea' rows='3' placeholder='Enter new club description here...' />
          </Form.Group>
          <Button variant='primary' type='submit'> Submit </Button>
        </Form>

        <div className='description'> Create a Meeting </div>
        <Form onSubmit={this.handleMeetingPost} id='meeting-post-form'>
          <Form.Group controlId='formPostMeeting'>
            <Form.Label> Meeting Name </Form.Label>
            <Form.Control name='summary' type='text' placeholder='Enter meeting name here...' />
            <Form.Label> Meeting Location </Form.Label>
            <Form.Control name='location' type='text' placeholder='Enter meeting location here...' />
            <Form.Label> Meeting Description </Form.Label>
            <Form.Control name='description' as='textarea' rows='3' placeholder='Enter meeting description here...' />
            <div>
              <TextField
                id='start-datetime'
                label='Start DateTime'
                type='datetime-local'
                defaultValue={new Date().toString()}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div>
              <TextField
                id='end-datetime'
                label='End DateTime'
                type='datetime-local'
                defaultValue={new Date().toString()}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
          </Form.Group>
          <Button variant='primary' type='submit'> Submit </Button>
        </Form>
        <div className='description'> Users who have requested to join: </div>
        <Row className='justify-content-center'>
          {this.state.requesters.map(r =>
            <UserCard
              key={r.id}
              user={r}
              club={this.state.club}
              fetchData={this.fetchData} />
          )}
        </Row>
        <Button id='delete-club' variant='danger' onClick={this.handleDelete}>Delete Club</Button>
      </div>
    );
  }
}

export default AdminClubPage;