import React, { Component } from 'react';
import { Button, CardDeck, Col, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ShowClubInvitesModal } from './ShowClubInvitesModal';

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
    let memberClubs = [];
    let ownerClubs = [];
    await Promise.all([
      fetch(`/api/clubs?memberIDs=${window.localStorage.getItem('userID')}`)
        .then(response => response.json())
        .then(clubs => clubs.length ? memberClubs = clubs : this.setState({ fetchingClubs: false }))
        .catch(e => console.error(e)),
      fetch(`/api/clubs?ownerID=${window.localStorage.getItem('userID')}`)
        .then(response => response.json())
        .then(clubs => clubs.length ? ownerClubs = clubs : this.setState({ fetchingClubs: false }))
        .catch(e => console.error(e))
    ]);
    let allClubs = memberClubs.concat(ownerClubs.filter((item) => memberClubs.indexOf(item) < 0));
    await Promise.all(
      allClubs.map(c =>
        fetch(`/api/search?gbookId=${c.gbookID}`)
          .then(response => response.json())
          .then(books => books[0])
          .then(book => book.authors && book.authors.length
            ? c.bookTitle = book.title
            : c.bookTitle = 'Nothing yet'
          )
          .catch(e => console.error(e))
      )
    )
      .then(this.setState({ clubs: allClubs, fetchingClubs: false }));
  }

  updateMyClubs = async (newClub) => {

    const userID = window.localStorage.getItem('userID');

    this.setState({fetchingClubs: true});

    const clubBook = await fetch(`/api/search?gbookId=${newClub.gbookID}`)
        .then(response => response.json())
        .catch(err => console.log(err));

    newClub.bookTitle = clubBook.title;
    newClub.memberIDs.push(userID);

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
            <h2 className='ml-2'>My Clubs</h2>
          </Col>
          <Col className='m-auto p-0 mr-3'>
            <div id='modal-buttons' className='mx-3'>
              <ShowClubInvitesModal
               btnStyle='btn btn-primary mx-3' 
               updateMyClubs={this.updateMyClubs}/>
              <Link to='/createclub'>
                <Button variant='primary'>
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