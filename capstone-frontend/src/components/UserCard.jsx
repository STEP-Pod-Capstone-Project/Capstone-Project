import React, { Component } from 'react';
import { Button, Col } from 'react-bootstrap';

import '../styles/Groups.css';


class UserCard extends Component {
  removeMember = () => {
    const jsonBody = {
      "remove_memberIDs": this.props.user.id, 
      "id": this.props.club.id
    }
    fetch(`/api/clubs`, {
        method: "put", 
        body: JSON.stringify(jsonBody)
      })
      .then(this.props.removeMember(this.props.user.id))
  }

  addFriend = () => {
    //TODO #86: Create friend functionality
  }

  render() {
    const removeMember = this.props.club 
                             && this.props.club.ownerID === window.localStorage.getItem("userID")
                             && this.props.club.ownerID !== this.props.user.id
                             && <Button id="remove-member" variant="danger" onClick={this.removeMember}>
                                  Remove&nbsp;Member
                                </Button>;
    return (
      <Col className="user-card" xs={{span: "2"}} >
        <img id="user-profile" src={this.props.user.profileImageUrl} alt="Profile"/>
        <div> {this.props.user.fullName} </div> 
        <Button variant="primary" onClick={this.addFriend}> Add Friend </Button>
        {removeMember}
      </Col>
    );
  }
} 
 
export default UserCard;
