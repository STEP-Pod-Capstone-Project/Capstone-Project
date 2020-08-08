import React, { Component } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
import { UserCard } from './UserCard';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
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
    let requesters = [];
    let members = [];
    fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/clubs?id=${this.props.id}`)
      .then(response => response.json()).then(clubs => {
        const club = clubs[0];
        this.setState({ club })
        Promise.all(club.requestIDs.map(r => {
          return fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/user?id=${r}`)
            .then(response => response.json())
            .then(member => {requesters.push(member)})
            .catch(e => console.log(e));
        }))
        Promise.all(club.memberIDs.map(m => {
          return fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/user?id=${m}`)
            .then(response => response.json())
            .then(member => {members.push(member)});
        }))
      })
      .then(() => this.setState({ members, requesters }))
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
      .then(() => history.push(`/clubpage/${data.id}`))
      .catch(e => console.log(e));
  }

  handleDelete = () => {
    if (window.localStorage.getItem('userID') !== this.state.club.ownerID) {
      alert('Delete failed. You do not own this club.');
      return;
    }
    const history = this.props.history;
    fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/clubs?id=${this.props.id}`, { method: 'delete' })
      .then(() => history.push('/myclubs'))
      .catch(e => console.log(e));
  }

  handleMeetingPost = (e) => {
    const history = this.props.history;
    e.preventDefault();
    const start = moment(new Date(document.getElementById('start-datetime').value));
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let rrule = '';
    if (document.getElementById('None').checked) {
      rrule = '';
    } else if (document.getElementById('Daily').checked) {
      rrule = 'RRULE:FREQ=DAILY;INTERVAL=1'
    } else if (document.getElementById('Weekly').checked) {
      const day = start.format('dd');
      rrule = `RRULE:FREQ=WEEKLY;BYDAY=${day};INTERVAL=1`
    } else if (document.getElementById('Monthly').checked) {
      const monthDay = start.format('D');
      rrule = `RRULE:FREQ=MONTHLY;BYMONTHDAY=${monthDay};INTERVAL=1`
    } else if (document.getElementById('Yearly').checked) {
      const month = start.format('M');
      const monthDay = start.format('D');
      rrule = `RRULE:FREQ=YEARLY;BYMONTH=${month};BYMONTHDAY=${monthDay};INTERVAL=1`
    } else {
      rrule = '';
    }
    const meeting = {
      token: JSON.parse(window.localStorage.getItem('token')),
      clubID: this.props.id,
      summary: e.target.summary.value,
      location: e.target.location.value,
      description: e.target.description.value,
      startDateTime: new Date(document.getElementById('start-datetime').value).getTime(),
      endDateTime: new Date(document.getElementById('end-datetime').value).getTime(),
      attendeeEmails: this.state.members.map(m => m.email),
      organizerEmail: JSON.parse(window.localStorage.getItem('profileObj')).email,
      recurrence: rrule,
      timezone: timezone,
    };
    fetch('/api/meetings', { method: 'post', body: JSON.stringify(meeting) })
      .then(() => history.push(`/clubpage/${meeting.clubID}`))
      .catch(e => console.error(e));
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    const requesters = this.state.requesters.length > 0 &&
      <>
        <h3> Users who have requested to join </h3>
        <Row className='justify-content-center'>
          {this.state.requesters.map(r =>
            <UserCard
              key={r.id}
              user={r}
              club={this.state.club}
              fetchData={this.fetchData} />
          )}
        </Row>
      </>
    return (
      <div className='container text-center'>
        <Link to={`/clubpage/${this.props.id}`}>
          <Button className='admin-button' variant='secondary'> Return to Club Page </Button>
        </Link>
        <div className='title'> {this.state.club.name} </div>
        <h3 className='mt-3'> Update Club Information </h3> 
        <Form onSubmit={this.handleUpdate} id='update-club-form'>
          <Form.Group controlId='formUpdateClub'>
            <Form.Label className='mt-2'> Club Name </Form.Label>
            <Form.Control className='mt-1' name='name' type='text' placeholder='Enter new club name here...' />
            <Form.Label className='mt-2'> Club Description </Form.Label>
            <Form.Control className='mt-1' name='description' as='textarea' rows='3' placeholder='Enter new club description here...' />
          </Form.Group>
          <Button variant='primary' type='submit'> Submit </Button>
        </Form>

        <h3 className='mt-5'> Create a Meeting </h3>
        <Form onSubmit={this.handleMeetingPost} id='meeting-post-form'>
          {/* TODO #139: use a controlled form instead*/}
          <Form.Group controlId='formPostMeeting'>
            <Form.Label className='mt-2'> Meeting Name </Form.Label>
            <Form.Control className='mt-1' name='summary' type='text' placeholder='Enter meeting name here...' />
            <Form.Label className='mt-2' > Meeting Location </Form.Label>
            <Form.Control className='mt-1' name='location' type='text' placeholder='Enter meeting location here...' />
            <Form.Label className='mt-2' > Meeting Description </Form.Label>
            <Form.Control className='mt-1' name='description' as='textarea' rows='3' placeholder='Enter meeting description here...' />
            <div className='mt-4'>
              <TextField
                id='start-datetime'
                label='Start DateTime'
                type='datetime-local'
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div className='mt-4'>
              <TextField
                id='end-datetime'
                label='End DateTime'
                type='datetime-local'
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
          </Form.Group>
          <Form.Group> 
             <Form.Label className='mt-1' as="legend" column xs={12}>
                Recurrence
              </Form.Label>
              <Col xs={12}>
                <Form.Check
                  type="radio"
                  label="None"
                  name="recurrenceRadios"
                  id="None"
                />
                <Form.Check
                  type="radio"
                  label="Daily"
                  name="recurrenceRadios"
                  id="Daily"
                />
                <Form.Check
                  type="radio"
                  label="Weekly"
                  name="recurrenceRadios"
                  id="Weekly"
                />
                <Form.Check
                  type="radio"
                  label="Monthly"
                   name="recurrenceRadios"
                  id="Monthly"
                />
                <Form.Check
                  type="radio"
                  label="Yearly"
                  name="formHorizontalRadios"
                  id="Yearly"
                />
              </Col>
          </Form.Group>
          <Button variant='primary' type='submit'> Submit </Button>
        </Form>
        {requesters}
        <Button id='delete-club' variant='danger' onClick={this.handleDelete}>Delete Club</Button>
      </div>
    );
  }
}

export default withRouter(AdminClubPage);
