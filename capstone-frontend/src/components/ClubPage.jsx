import React, { Component } from 'react';

import BookSearchTile from './BookSearchTile';
import AssignmentCard from './AssignmentCard';
 
import '../styles/Groups.css';
 
class ClubPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      club: {},
      book: {},
      assignments: [],
      owner: {}, 
      members: []
    }
  }

  fetchClubData = async () => {
    let club = await fetch(`https://8080-0b34ed39-12e2-4bb0-83f0-3edbd4365bbd.us-east1.cloudshell.dev/api/clubs?id=${this.props.match.params.id}`, 
    {credentials:'include'})
        .then(response => response.json()).then(res => this.setState({club: res[0]})).then(console.log(this.state.club))
        .catch(function(err) {
            //TODO #61: Centralize error output
            alert(err);
        });
    console.log('club');
    console.log(club);
  }

  fetchBookData = () => {
    fetch(`https://8080-0b34ed39-12e2-4bb0-83f0-3edbd4365bbd.us-east1.cloudshell.dev/api/search?id=${this.state.club.gbookID}`, 
    {credentials:'include'})
        .then(response => response.json()).then(res => this.setState({book: res[0]})).then(console.log(this.state.book))
        .catch(function(err) {
            //TODO #61: Centralize error output
            alert(err);
        });
  }

  fetchAssignmentData = () => {
    fetch(`https://8080-0b34ed39-12e2-4bb0-83f0-3edbd4365bbd.us-east1.cloudshell.dev/api/assignments?clubID=${this.state.club.id}`, 
    {credentials:'include'})
        .then(response => response.json()).then(res => this.setState({assignments: res})).then(console.log(this.state.assignments))
        .catch(function(err) {
            //TODO #61: Centralize error output
            alert(err); 
        });
  }
 
  fetchMemberData = async () => {
    fetch(`https://8080-0b34ed39-12e2-4bb0-83f0-3edbd4365bbd.us-east1.cloudshell.dev/api/user?id=${this.state.club.ownerID}`, 
    {credentials:'include'})
        .then(response => response.json()).then(res => this.setState({owner: res[0]})).then(console.log(this.state.owner))
        .catch(function(err) {
            //TODO #61: Centralize error output
            alert(err); 
        });
    let memberID;
    for (memberID of this.state.club.memberIDs) {
      fetch(`https://8080-0b34ed39-12e2-4bb0-83f0-3edbd4365bbd.us-east1.cloudshell.dev/api/user?id=${memberID}`, 
      {credentials:'include'})
          .then(response => response.json())
          .then(function(res) {
              let memberArray = this.state.members.concat(res[0]);
              this.setState({members: memberArray})
          }).then(console.log(this.state.members))
          .catch(function(err) {
            //TODO #61: Centralize error output
            alert(err); 
          });
    } 
  }
 
  handleClick = () => {
    const history = this.props.history;
    fetch(`https://8080-0b34ed39-12e2-4bb0-83f0-3edbd4365bbd.us-east1.cloudshell.dev/api/clubs?id=${this.props.match.params.id}`, {method: "delete"})
        .then(function() {
            history.push("/myclubs");
        })
        .catch(function(err) {
            //TODO #61: Centralize error output
            alert(err);
        });
  }
 
  componentDidMount() {
    this.fetchClubData();
    this.fetchBookData();
    this.fetchAssignmentData();
    this.fetchMemberData();
  }
 
  render() {
    console.log(this.state);
    return (
      <div className="text-center">
        <div className="title"> Club Name: {this.state.club.name} </div>
        <div> Club Owner: {this.state.owner.fullname}, {this.state.owner.email} </div>
        <div> Club Members: {this.state.members.map(m => m.profileObj.fullname)} </div>
        <div className="description"> Description: {this.state.club.description} </div>
        <div className="description"> Current Book: </div>
        <div> {this.state.assignments.map(a => <AssignmentCard assignment={a} owner={this.state.owner} />)} </div>
        <button onClick={this.handleClick}> Delete </button>
      </div>
    );
  }
}
 
export default ClubPage;
