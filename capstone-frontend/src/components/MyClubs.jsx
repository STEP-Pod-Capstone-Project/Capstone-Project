import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import ClubGridItem from './ClubGridItem';

import '../styles/Groups.css';

class MyClubs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clubs: []
    }
  }

  getMyClubs = () => {
    fetch("/api/clubs").then(response => response.json()).then(res => {
      this.setState({clubs: res});
    });
  }

  componentDidMount() {
    this.getMyClubs();
  }

  render() {
    let clubArray = [];
    this.state.clubs.forEach(c => {
      clubArray.push(<ClubGridItem key={c.id} id={c.id} name={c.name} description={c.description} ownerID={c.ownerID} gbookID={c.gbookID} />);
    });
    for (let i = 0; i < 5; i++)
    clubArray.push(<ClubGridItem key={i} id={i} name={i} description={i} ownerID={i} gbookID={i} />);
    return (
      <div className="page-container">
        <div className="row">
          <div className="col-12 title"> My Clubs </div>
        </div>
        <div className="row"> 
          <Link id="create-group" className="col-12" to="/createclub"> Create New Club </Link> 
        </div>
          <div className="groups-list-container row"> {clubArray} </div>
      </div>
      
    );
  }
}

export default MyClubs;