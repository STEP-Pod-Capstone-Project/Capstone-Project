import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserCard from './UserCard'


import '../styles/Groups.css';

class AdminClubPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      club: {},
      requesters: []
    }
  }

  fetchData = async () => {
    const club = await fetch(`/api/clubs?id=${this.props.match.params.id}`)
      .then(response => response.json()).then(clubs => this.setState({ club: clubs[0] }))
      .catch(function (err) {
        //TODO #61: Centralize error output
        alert(err);
      });

    for (let i = 0; i < club.requestIDs.length; i++) {
      await fetch(`/api/user?id=${this.state.club.requestIDs[i]}`)
        .then(response => response.json())
        .then(member => member && this.setState({ requesters: [...this.state.requesters, member] }))
        .catch(function (err) {
          //TODO #61: Centralize error output
          alert(err);
        });
    }
  }

  handleUpdate = (e) => {
    const history = this.props.history;
    e.preventDefault();
    let data = {};
    const formElements = document.getElementById("update-club-form").elements;
    for (let i = 0; i < formElements.length; i++) {
      if (formElements[i].name.length !== 0 &&
        formElements[i].type !== "submit" && formElements[i].value.length !== 0) {
        data[formElements[i].name] = formElements[i].value;
      }
    }
    data.id = this.state.club.id;
    if (window.localStorage.getItem("userID") !== this.state.club.ownerID) {
      alert("Update failed. You do not own this club.");
      return;
    }

    fetch("/api/clubs", { method: "put", body: JSON.stringify(data) })
      .then(function () {
        history.push(`/clubpage/${data.id}`);
      })
      .catch(function (e) {
        console.log(e);
        alert("Looks like we're having trouble connecting to our database, hang tight!");
      });
  }

  handleDelete = () => {
    if (window.localStorage.getItem("userID") !== this.state.club.ownerID) {
      alert("Delete failed. You do not own this club.");
      return;
    }
    const history = this.props.history;
    fetch(`/api/clubs?id=${this.props.match.params.id}`, { method: "delete" })
      .then(function () {
        history.push("/myclubs");
      })
      .catch(function (err) {
        //TODO #61: Centralize error output
        alert(err);
      });
  }

  removeMember = (memberID) => {
    let memberArray = this.state.members;
    let memberIDsArray = this.state.members.map(m => m.id);
    const index = memberIDsArray.indexOf(memberID);
    if (index > -1) {
      memberArray.splice(index, 1);
    }
    this.setState({members: memberArray});
  }

  handleRequester = (memberID) => {
    let requestersArray = this.state.requestIDs;
    let requestIDsArray = this.state.requestIDs.map(m => m.id);
    const index = requestIDsArray.indexOf(memberID);
    if (index > -1) {
      requestersArray.splice(index, 1);
    }
    this.setState({requesters: requestersArray});
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    console.log("admin: " + this.state);
    const requesters = this.state.requesters.length &&
      this.state.requesters.map(m =>
        <UserCard 
          key={m.id}
          user={m}
          club={this.state.club}
          handleRequest = {this.handleRequester} />);
    return (
      <div className="container text-center">
        <Link to={`/clubpage/${this.props.match.params.id}`}>
          <Button className="admin-button" variant="secondary"> Return to Club Page </Button>
        </Link>
        <div className="title"> {this.state.club.name} </div>
        <Form onSubmit={this.handleUpdate} id="update-club-form">
          <Form.Group controlId="formUpdateClub">
            <Form.Label> Club Name </Form.Label>
            <Form.Control name="name" type="text" placeholder="Enter new club name here..." />
            <Form.Label> Club Description </Form.Label>
            <Form.Control name="description" as="textarea" rows="3" placeholder="Enter new club description here..." />
          </Form.Group>
          <Button variant="primary" type="submit"> Submit </Button>
        </Form>
        {requesters}
        <Button id="delete-club" variant="danger" onClick={this.handleDelete}>Delete Club</Button>
      </div>
    );
  }
}

export default AdminClubPage;