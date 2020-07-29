import React, { Component } from 'react';
import { CardDeck } from 'react-bootstrap';
import ClubGridItem from './ClubGridItem.jsx'
import '../App.css';

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      clubs: [],
      myBookListsMap: new Map(),
      sharedBookListsMap: new Map(),
    };
  }

  componentDidMount() {
    this.fetchClubs();
  }

  componentDidUpdate(prevProps) {

          console.log(this.props, prevProps);

    if (this.props.bookLists.length !== prevProps.bookLists.length) {
      this.fetchBookListsImages(this.props.bookLists, 'own');
    }

    if (this.props.collabBookLists.length !== prevProps.collabBookLists.length) {
      this.fetchBookListsImages(this.props.collabBookLists, 'shared');
    }
  }

  fetchClubs = async () => {

    const userID = window.localStorage.getItem('userID');

    const clubsOwner = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/clubs?ownerID=${userID}`).then(resp => resp.json());

    const clubsMember = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/clubs?memberIDs=${userID}`).then(resp => resp.json());

    const clubs = [...clubsOwner, ...clubsMember];

    this.setState({ clubs });
  }

  fetchBookListsImages = async (bookLists, type) => {

    let bookListsMap = new Map();

    await Promise.all(bookLists.map(async bookList => {

      if (bookList.gbookIDs.length === 0) {
        bookListsMap.set(bookList, [])
        return;
      }

      let gBooks = [];

      // Reduce to four elements
      const bookIDs = bookList.gbookIDs.slice(0, 4);

      await Promise.all(bookIDs.map(async gBookId => {

        const gBook = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/search?gbookId=${gBookId}`).then(resp => resp.json());

        gBooks.push(gBook[0]);


      }));

      bookListsMap.set(bookList, gBooks);
    }))

    console.log('Map', bookListsMap)

    if (type === 'own') {
      this.setState({ myBookListsMap: bookListsMap });
    }
    else if (type === 'shared') {
      this.setState({ sharedBookListsMap: bookListsMap });
    }
  }


  render() {
    console.log('this.state', this.state)
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