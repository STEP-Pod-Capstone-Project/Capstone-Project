import React, { Component } from 'react';
import { Button, CardDeck, Col, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ShowClubInvitesModal } from './ShowClubInvitesModal'

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


    let memberClubs = await fetch(`/api/clubs?memberIDs=${window.localStorage.getItem("userID")}`)
      .then(response => response.json())
      .catch(function (err) {
        //TODO #61: Centralize error output
        alert(err);
      });

    let ownerClubs = await fetch(`/api/clubs?ownerID=${window.localStorage.getItem("userID")}`)
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
      let owner = await fetch(`/api/user?id=${c.ownerID}`)
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
        book = await fetch(`/api/search?gbookId=${c.gbookID}`)
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

  updateMyClubs = async (newClub ) => {

    this.setState({fetchingClubs: true});

    const clubBook = await fetch(`/api/search?gbookId=${newClub.gbookID}`)
        .then(response => response.json())
        .catch(err => console.log(err));

    newClub.bookTitle = clubBook.title;

    this.setState({clubs: [...this.state.clubs, newClub], fetchingClubs: false, })
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
      <div>
        <Row>
          <Col>
            <h2 className="ml-2">My Clubs</h2>
          </Col>
          <Col className='m-auto p-0 mr-3'>
            <div id='modal-buttons' className='mx-3'>
              <ShowClubInvitesModal
               btnStyle='btn btn-primary mx-3' 
               updateMyClubs={this.updateMyClubs}/>
              <Link to="/createclub">
                <Button variant="primary">
                  Create New Club
              </Button>
              </Link>
            </div>
          </Col>
        </Row>
        <hr className='light-gray-border mx-2 my-2' />

        <div className="page-container">
          {this.state.fetchingClubs ?
            (<div className="text-center mt-4">
              <Spinner variant="primary" animation="border" role="status" />
            </div>)
            :
            <CardDeck className="groups-list-container"> {clubArray} </CardDeck>
          }
        </div>
      </div>
    );
  }
}

export default MyClubs;