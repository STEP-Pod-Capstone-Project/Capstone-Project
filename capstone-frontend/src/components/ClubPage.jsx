import React, { Component } from 'react';
import BookSearchTile from './BookSearchTile';

import '../styles/Groups.css';

class ClubPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      club: {}, 
      owner: {}, 
      members: [],
      book: {}
    }
  }

  fetchMemberData = () => {
    fetch(`/api/users?id=${this.state.club.ownerID}`)
        .then(response => response.json()).then(res => this.setState({owner: res[0]}))
        .catch(function(err) {
            //TODO #61: Centralize error output
            alert(err); 
        });
    for (memberID in this.state.club.memberIDs) {
      fetch(`/api/users?id=${memberID}`)
          .then(response => response.json())
          .then(function(res) {
              let memberArray = this.state.members.concat(res[0]);
              this.setState({members: memberArray})
          })
          .catch(function(err) {
            //TODO #61: Centralize error output
            alert(err); 
          });
    } 
  }

  fetchBookData = () => {
    fetch(`/api/search?id=${this.state.club.gbookID}`)
        .then(response => response.json()).then(res => this.setState({book: res[0]}))
        .catch(function(err) {
            //TODO #61: Centralize error output
            alert(err);
        });
  }

  fetchClubData = () => {
    fetch(`/api/clubs?id=${this.props.match.params.id}`)
        .then(response => response.json()).then(res => this.setState({club: res[0]}))
        .catch(function(err) {
            //TODO #61: Centralize error output
            alert(err);
        });
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
    this.fetchClubData();
    this.fetchMemberData();
    this.fetchBookData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.fetchClubData();
      this.fetchMemberData();
      this.fetchBookData();
    }
  }

  render() {
    return (
      <div className="text-center">
        <div className="title"> Club Name: {this.state.club.name} </div>
        <div> Club Owner: {this.state.owner.fullname} </div>
        <div> Club Members: {this.state.members.map(m -> m.profileObj.fullname)} </div>
        <div className="description"> Description: {this.state.club.description} </div>
        <div className="description"> Current Book: </div>
        <BookSearchTile book={this.state.book} />
        <div> {this.state.club.assignments} <div>
        <button onClick={this.handleClick}> Delete </button>
      </div>
    );
  }
}

export default ClubPage;
