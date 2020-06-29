import React, { Component } from 'react';

class ClubPage extends Component {
  render() {
    return (
      <div>
        <div> {this.props.match.params.id} </div>
      </div>
    );
  }
}

export default ClubPage;