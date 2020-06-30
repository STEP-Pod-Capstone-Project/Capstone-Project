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
    this.getMyClubs = this.getMyClubs.bind(this);
  }

  getMyClubs() {
    let clubArray = [];
    for (let i = 0; i < 8; i++) {
      clubArray.push({
        "id": i,
        "name": `Club${i}`,
        "description": `Description${i} Description${i} Description${i} Description${i} Description${i}`,
        "ownerID": i+i,
        "gbookID": i*i
      });
    }
    this.setState({clubs: clubArray});
  }

  componentDidMount() {
    this.getMyClubs();
  }

  render() {
    let clubArray = [];
    this.state.clubs.forEach(c => {
      clubArray.push(<ClubGridItem key={c.id} id={c.id} name={c.name} description={c.description} ownerID={c.ownerID} gbookID={c.gbookID} />);
    });
    return (
      <div className="row page-container">
        <div className="col-12 title"> My Clubs </div>
        <div> 
          <Link id="create-group" className="col-12" to="/createclub"> Create New Club </Link> 
        </div>
        <div className="groups-list-container row"> {clubArray} </div>
      </div>
      
    );
  }
}

export default MyClubs;