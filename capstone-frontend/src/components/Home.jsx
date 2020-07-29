import React, { Component } from 'react';
import { CardDeck } from 'react-bootstrap';
import ClubGridItem from './ClubGridItem.jsx'
import '../App.css';

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      clubs: [],
    };
  }

  componentDidMount() {
    this.fetchClubs();
    this.fetchBookLists();
  }

  fetchClubs = async () => {

    const userID = window.localStorage.getItem('userID');

    const clubsOwner = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/clubs?ownerID=${userID}`).then(resp => resp.json());

    const clubsMember = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/clubs?memberIDs=${userID}`).then(resp => resp.json());

    const clubs = [...clubsOwner, ...clubsMember];

    this.setState({ clubs });
  }

  fetchBookLists = async () => {

    const userID = window.localStorage.getItem('userID');

    const bookLists = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/booklist?userID=${userID}`).then(resp => resp.json())[0];

    console.log("bookLists", bookLists)

  }


  render() {
    return (
      <div>
        <h1 className="text-center">Clubs</h1>
        <hr className="light-gray-border mt-0" />

        <CardDeck className='groups-list-container'>
          {
            this.state.clubs.map(club =>
              <ClubGridItem key={club.id} club={club} />)
          }
        </CardDeck>

        <h1 className="text-center">My BookLists</h1>
        <hr className="light-gray-border mt-0" />

        <p className="text-center">BookLists HERE</p>

        <h1 className="text-center">Shared BookLists</h1>
        <hr className="light-gray-border mt-0" />

        <p className="text-center">Collab BookLists</p>
      </div>
    );
  }
}

export default Home;