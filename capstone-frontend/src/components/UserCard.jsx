import React, { Component } from 'react';
import { Button, Col } from 'react-bootstrap';

import '../styles/Groups.css';


class UserCard extends Component {
  removeMember = () => {
    fetch(`https://8080-bfda3bef-a7ee-4ff4-91c6-c56fa0a00eba.ws-us02.gitpod.io/api/clubs`, {
      method: "put", 
      body: {
        "remove_memberIDs": this.props.user.id, 
        "id": this.props.club.id
        }
      })
      .then(this.props.removeMember(this.props.user.id))
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
        <img id="user-profile" src={this.props.user.profileImageUrl} alt="Profile Picture not found"/>
        <div> {this.props.user.fullName} </div> 
        <Button variant="primary"> Add Friend </Button>
        {removeMember}
      </Col>
    );
  }
} 
 
export default UserCard;
