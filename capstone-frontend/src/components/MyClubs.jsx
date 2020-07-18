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

  getMyClubs = async () => {
    let memberClubs = await fetch(`/api/clubs?memberIDs=${window.localStorage.getItem("userID")}`)
        .then(response => response.json())
        .catch(function(err) {
          //TODO #61: Centralize error output
          alert(err); 
        });

    let ownerClubs = await fetch(`/api/clubs?ownerID=${window.localStorage.getItem("userID")}`)
        .then(response => response.json())
        .catch(function(err) {
          //TODO #61: Centralize error output
          alert(err); 
        });
    
    let allClubs = memberClubs.concat(ownerClubs.filter((item) => memberClubs.indexOf(item) < 0));

    this.setState({clubs: allClubs});
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