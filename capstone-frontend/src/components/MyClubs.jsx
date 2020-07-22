import React, { Component } from 'react';
import { Button, CardDeck, Col, Row } from 'react-bootstrap';
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
    if (!memberClubs) memberClubs = [];
    if (!ownerClubs) ownerClubs = [];
    let allClubs = memberClubs.concat(ownerClubs.filter((item) => memberClubs.indexOf(item) < 0));
    let c;
    for (c of allClubs) {
      let owner = await fetch(`/api/user?id=${c.ownerID}`)
                                .then(response => response.json())
                                .catch(function(err) {
                                  //TODO #61: Centralize error output
                                  alert(err); 
                                });
      
      let book = await fetch(`/api/search?gbookId=${c.gbookID}`)
                                .then(response => response.json())
                                .then(books => books[0])
                                .catch(function(err) {
                                  //TODO #61: Centralize error output
                                  alert(err); 
                                });
      c.ownerName = owner.fullName;
      c.bookTitle = book.title;
    }

    this.setState({clubs: allClubs});
  }

  componentDidMount() {
    this.getMyClubs();
  }

  render() {
    let clubArray = [];
    this.state.clubs.forEach(c => {
      clubArray.push(<ClubGridItem key={c.id} club={c} />);
    });
    return (
      <div className="page-container">
        <Row>
          <Col xs={12} className="title"> My Clubs </Col>
        </Row>
          <Link id="create-group" to="/createclub"> 
            <Button variant="primary">
              Create New Club 
            </Button>
          </Link> 
          <CardDeck className="groups-list-container"> {clubArray} </CardDeck>
      </div>
      
    );
  }
}

export default MyClubs;