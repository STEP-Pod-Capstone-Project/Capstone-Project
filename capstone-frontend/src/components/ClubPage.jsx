import React, { Component } from 'react';


class ClubPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      club: {}
    }
  }

  fetchClubData = () => {
    fetch(`/api/clubs?id=${this.props.match.params.id}`)
        .then(response => response.json()).then(res => this.setState({club: res[0]}));
  }

  componentDidMount() {
    this.fetchClubData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.fetchClubData();
    }
  }

  render() {
    return (
      <div>
        <div> Club Name: {this.state.club.name} </div>
        <div> ID: {this.props.match.params.id} </div>
        <div> Description: {this.state.club.description} </div>
        <div> OwnerID: {this.state.club.ownerID} </div>
        <div> GbookID: {this.state.club.gbookID} </div>
      </div>
    );
  }
}

export default ClubPage;