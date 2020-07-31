import React, { Component } from 'react';
import { Button, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserCard } from './UserCard';
import TextField from '@material-ui/core/TextField';
import '../styles/Groups.css';
// import google from 'googleapis';


class AdminClubPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      club: {},
      requesters: [],
      memberEmails: [],
    }
  }

  fetchData = () => {
    fetch(`https://8080-bfda3bef-a7ee-4ff4-91c6-c56fa0a00eba.ws-us02.gitpod.io/api/clubs?id=${this.props.match.params.id}`)
      .then(response => response.json()).then(clubs => {
        const club = clubs[0];
        this.setState({ club, requesters: [], members: [] });
        Promise.all(club.requestIDs.map(r => {
          return fetch(`https://8080-bfda3bef-a7ee-4ff4-91c6-c56fa0a00eba.ws-us02.gitpod.io/api/user?id=${r}`)
            .then(response => response.json())
            .then(member => member && this.setState({ requesters: [...this.state.requesters, member] }))
            .catch(e => console.log(e));
        }))
        Promise.all(club.memberIDs.map(m => {
          return fetch(`https://8080-bfda3bef-a7ee-4ff4-91c6-c56fa0a00eba.ws-us02.gitpod.io/api/user?id=${m}`)
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

    fetch('https://8080-bfda3bef-a7ee-4ff4-91c6-c56fa0a00eba.ws-us02.gitpod.io/api/clubs', { method: 'put', body: JSON.stringify(data) })
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
    fetch(`https://8080-bfda3bef-a7ee-4ff4-91c6-c56fa0a00eba.ws-us02.gitpod.io/api/clubs?id=${this.props.match.params.id}`, { method: 'delete' })
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
    const auth = window.localStorage.getItem('auth');
    // const calendar = google.calendar({ version: 'v3', auth });
    const memberEmails = this.state.members.map(m => {
      return { email: m.email };
    });
    console.log(document.getElementById('start-datetime').value);
    const backendMeeting = {
      clubID: this.props.match.params.id, 
      summary: e.target.name.value,
      location: e.target.name.value, 
      description: e.target.name.value,
      startDateTime: document.getElementById('start-datetime').value, 
      endDateTime: document.getElementById('end-datetime').value, 
      eventAttendees: memberEmails.map(m => m.email),
      organizerEmail: window.localStorage.getItem('profileObj').email, 
      organizerName: window.localStorage.getItem('profileObj').fullName,
    }
    fetch('/api/meetings', {method: 'post', body: JSON.stringify(backendMeeting)})
        .catch(e => console.log(e));
    const event = {
      'summary': e.target.name.value,
      'location': e.target.location.value,
      'description': e.target.name.description,
      'start': {
        'dateTime': document.getElementById('start-datetime').value,
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'end': {
        'dateTime': document.getElementById('end-datetime').value,
        'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      'attendees': memberEmails,
      'reminders': {
        'useDefault': false,
        'overrides': [
          { 'method': 'email', 'minutes': 24 * 60 },
          { 'method': 'popup', 'minutes': 10 }
        ]
      }
    };

    // var request = calendar.events.insert({
    //   'calendarId': 'primary',
    //   'resource': event
    // });

    // request.execute(function (event) {
    //   console.log('Event created: ' + event.htmlLink);
    // });
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