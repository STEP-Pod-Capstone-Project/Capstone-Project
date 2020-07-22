import React, { Component } from 'react';
import { Button, Col } from 'react-bootstrap';

import '../styles/Groups.css';


class UserCard extends Component {
  removeMember = () => {
    const jsonBody = {
      "remove_memberIDs": this.props.user.id,
      "id": this.props.club.id
    }
    fetch(`/api/clubs`, { method: "put", body: JSON.stringify(jsonBody) })
      .then(this.props.removeMember(this.props.user.id))
      .catch(function (err) {
        //TODO #61: Centralize error output
        alert(err);
      });
  }

  acceptMember = () => {
    const jsonBody = {
      "remove_requestIDs": this.props.user.id,
      "add_memberIDs": this.props.user.id,
      "id": this.props.club.id
    };
    fetch("/api/clubs", { method: "put", body: JSON.stringify(jsonBody) })
      .then(this.props.handleRequester(this.props.user.id))
      .catch(function (err) {
        //TODO #61: Centralize error output
        alert(err);
      });
  }

  rejectMember = () => {
    const jsonBody = {
      "remove_requestIDs": this.props.user.id,
      "id": this.props.club.id
    };
    fetch("/api/clubs", { method: "put", body: JSON.stringify(jsonBody) })
      .then(this.props.handleRequester(this.props.user.id))
      .catch(function (err) {
        //TODO #61: Centralize error output
        alert(err);
      });
  }

  addFriend = () => {
    //TODO #86: Create friend functionality
  }

  render() {
    console.log("usercard: ");
    console.log(this.props);
    const isMember = this.props.club && this.props.club.memberIDs && this.props.club.memberIDs.includes(this.props.user.id);
    const isRequester = this.props.club && !isMember && this.props.club.requestIDs.includes(this.props.user.id);
    const removeMember = this.props.club
      && this.props.club.ownerID === window.localStorage.getItem("userID")
      && this.props.club.ownerID !== this.props.user.id
      && <Button id="remove-member" variant="danger" onClick={this.removeMember}>
           Remove&nbsp;Member
         </Button>;
    const requestButtons = this.props.club
      && this.props.club.ownerID === window.localStorage.getItem("userID")
      && this.props.club.ownerID !== this.props.user.id
      && <div>
           <Button variant="primary" onClick={this.acceptMember}>
             Accept&nbsp;Member
           </Button>
           <Button variant="danger" onClick={this.rejectMember}>
             Reject&nbsp;Member
           </Button>
         </div>
    return (
      <Col className="user-card" xs={{ span: "2" }} >
        <img id="user-profile" src={this.props.user.profileImageUrl} alt="Profile" />
        <div> {this.props.user.fullName} </div>
        <Button variant="primary" onClick={this.addFriend}> Add Friend </Button>
        {isMember && removeMember}
        {isRequester && requestButtons}
      </Col>
    );
  }
}

export default UserCard;
