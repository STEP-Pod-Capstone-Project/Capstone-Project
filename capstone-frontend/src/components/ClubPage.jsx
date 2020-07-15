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

  fetchData = async () => {
    await fetch(`/api/clubs?id=${this.props.id}`)
        .then(response => response.json()).then(response => this.setState({club: response[0]}))
        .catch(function(err) {
            //TODO #61: Centralize error output
            alert(err);
        });

    await fetch(`/api/search?gbookId=${this.state.club.gbookID}`)
        .then(response => response.json()).then(response => this.setState({book: response[0]}))
        .catch(function(err) {
            //TODO #61: Centralize error output
            alert(err);
        });

    await fetch(`/api/assignments?clubID=${this.state.club.id}`)
        .then(response => response.json()).then(response => this.setState({assignments: response}))
        .catch(function(err) {
            //TODO #61: Centralize error output
            alert(err); 
        });

    await fetch(`/api/user?id=${this.state.club.ownerID}`)
        .then(response => response.json()).then(response => this.setState({owner: response}))
        .catch(function(err) {
            //TODO #61: Centralize error output
            alert(err); 
        });

    for (let i = 0; i < this.state.club.memberIDs.length; i++) {
      await fetch(`/api/user?id=${this.state.club.memberIDs[i]}`)
          .then(response => response.json())
          .then(response => response && this.setState({members: [...this.state.members, response]}))
          .catch(function(err) {
            //TODO #61: Centralize error output
            alert(err); 
          });
    }
  }
 
  handleClick = () => {
    const history = this.props.history;
    fetch(`/api/clubs?id=${this.props.match.params.id}`, {method: "delete"})
        .then(function() {
            history.push("/myclubs");
        })
        .catch(function(err) {
            //TODO #61: Centralize error output
            alert(err);
        });
  }
 
  componentDidMount() {
    this.fetchData();
  }
 
  render() {
    const bookTile = this.state.book.authors && <BookSearchTile book={this.state.book} userBookLists={[]} updateBookLists={this.props.fetchBookLists}/>;
    const owner = this.state.owner && <div> Club Owner: {this.state.owner.fullName}, {this.state.owner.email} </div>;
    const members = this.state.members.length && <div> Club Members: {this.state.members.map(m => m.fullName).join(", ")} </div>;
    const assignments = this.state.assignments.length && <div> {this.state.assignments.map(a => <AssignmentCard key={a.id} assignment={a} />)} </div>;
    return (
      <div className="text-center"> 
        <div className="title"> {this.state.club.name} </div>
        {owner}
        {members}
        <div className="description"> {this.state.club.description} </div>
        {bookTile}
        {assignments}
        <button onClick={this.handleClick}> Delete </button>
      </div>
    );
  }
}
 
export default ClubPage;
