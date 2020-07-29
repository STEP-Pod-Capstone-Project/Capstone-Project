import React, { Component } from 'react';
import { Button, CardDeck, Col, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import ClubGridItem from './ClubGridItem';

import '../styles/Groups.css';

class MyClubs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clubs: [],
      fetchingClubs: false, // Spinner
    }
  }

  getMyClubs = async () => {

    this.setState({ fetchingClubs: true });


    let memberClubs = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/clubs?memberIDs=${window.localStorage.getItem("userID")}`)
      .then(response => response.json())
      .catch(function (err) {
        //TODO #61: Centralize error output
        alert(err);
      });

    let ownerClubs = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/clubs?ownerID=${window.localStorage.getItem("userID")}`)
      .then(response => response.json())
      .catch(function (err) {
        //TODO #61: Centralize error output
        alert(err);
      });

    if (!memberClubs) {
      memberClubs = [];
      this.setState({ fetchingClubs: false });
    }
    if (!ownerClubs) {
      ownerClubs = [];
      this.setState({ fetchingClubs: false });
    }

    let allClubs = memberClubs.concat(ownerClubs.filter((item) => memberClubs.indexOf(item) < 0));
    let c;
    for await (c of allClubs) {
      let owner = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/user?id=${c.ownerID}`)
        .then(response => response.json())
        .catch(function (err) {
          //TODO #61: Centralize error output
          alert(err);
        });
      let book;
      if (c.gbookID === '') {
        book = { title: 'Nothing yet' };
      }
      else {
        book = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/search?gbookId=${c.gbookID}`)
          .then(response => response.json())
          .then(books => books[0])
          .catch(function (err) {
            //TODO #61: Centralize error output
            alert(err);
          });
      }

      c.ownerName = owner.fullName;
      c.bookTitle = book.title;
    }
    this.setState({ clubs: allClubs, fetchingClubs: false });
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
        <Link to="/createclub">
          <Button variant="primary">
            Create New Club
          </Button>
        </Link>

        {this.state.fetchingClubs ?
          (<div className="text-center mt-4">
            <Spinner variant="primary" animation="border" role="status" />
          </div>)
          :
          <CardDeck className="groups-list-container"> {clubArray} </CardDeck>
        }
      </div>
    );
  }
}

export default MyClubs;