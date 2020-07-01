import React, { Component } from 'react';

class ClubPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: {}
    }
  }

  fetchClubData = () => {
    fetch(`/api/clubs?id=${this.props.match.params.id}`)
        .then(response => response.json()).then(res => this.setState({response: res[0]}));
  }

  render() {
    this.fetchClubData();
    return (
      <div>
        <div> Club Name: {this.state.response.name} </div>
        <div> ID: {this.props.match.params.id} </div>
        <div> Description: {this.state.response.description} </div>
        <div> OwnerID: {this.state.response.ownerID} </div>
        <div> GbookID: {this.state.response.gbookID} </div>
      </div>
    );
  }
}

export default ClubPage;