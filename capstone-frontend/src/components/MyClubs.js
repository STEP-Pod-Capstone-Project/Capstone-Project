import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import ClubGridItem from './ClubGridItem.js';

import '../styles/Clubs.css';

class MyClubs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clubs: []
    }
  }

  getMyClubs = () => {
    fetch("https://8080-0b34ed39-12e2-4bb0-83f0-3edbd4365bbd.us-east1.cloudshell.dev/api/clubs", 
    {credentials: "include"}).then(response => response.json()).then(res => {
      this.setState({clubs: res});
    });
  }

  componentDidMount() {
    this.getMyClubs();
  }

  render() {
    let clubArray = [];
    [...this.state.clubs].forEach(c => {
      clubArray.push(<ClubGridItem key={c.id} id={c.id} name={c.name} description={c.description} ownerID={c.ownerID} gbookID={c.gbookID} />);
    });
    return (
      <div className="page-container">
        <div className="row">
          <div className="col-12 title"> My Clubs </div>
        </div>
        <div className="row"> 
          <Link id="createclub" className="col-12" to="/createclub"> Create New Club </Link> 
        </div>
        <div className="clubslist-container row"> {clubArray} </div>
      </div>
      
    );
  }
}

export default MyClubs;