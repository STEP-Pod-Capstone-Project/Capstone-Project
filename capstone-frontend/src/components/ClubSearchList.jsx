import React, { Component } from 'react';
import { CardDeck } from 'react-bootstrap';
import ClubGridItem from './ClubGridItem';

import '../styles/Groups.css';

export class ClubSearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clubs: [],
    }
    let _isMounted = false;
  }

  getData = async () => {
    // Get clubs by searchQuery
    let clubs = await fetch(`https://8080-c0019ecb-52af-4655-945f-b5a74df1e54b.ws-us02.gitpod.io/api/clubSearch?searchTerm=${this.props.searchQuery}`)
      .then(response => response.json())
      .catch(err => alert(err));

    console.log("clubs bef bef", clubs);
    // Get clubs by books in search
    console.log("bookys", this.props.books);
    await Promise.all(this.props.books.map(async (book) => {
      const clubsWithBook = await fetch(`https://8080-c0019ecb-52af-4655-945f-b5a74df1e54b.ws-us02.gitpod.io/api/clubs?gbookID=${book.id}`)
        .then(response => response.json())
        .catch(err => alert(err));
      if (clubsWithBook.length > 0) {
        clubs = [...clubs, clubsWithBook];
      }
    }));
    clubs = clubs.flat();
    console.log("clubs bef", clubs);
    // Fill in book titles for all clubs
    await Promise.all(clubs.map(async (club) => {
      if (club.gbookID.length > 0) {
        const book = await fetch(`https://8080-c0019ecb-52af-4655-945f-b5a74df1e54b.ws-us02.gitpod.io/api/search?gbookId=${club.gbookID}`)
          .then(response => response.json())
          .catch(err => alert(err));
        club.bookTitle = book[0].title;
      }
      if (club.ownerID.length > 0) {
        const owner = await fetch(`https://8080-c0019ecb-52af-4655-945f-b5a74df1e54b.ws-us02.gitpod.io/api/user?id=${club.ownerID}`)
          .then(response => response.json())
          .catch(err => alert(err));
        club.ownerName = owner.fullName;
      }
    }));
    console.log("post clubs", clubs);

    this.setState({ clubs });
  }

  componentDidMount() {
    this._isMounted = true;

    if (this._isMounted) {
      this.getData();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.searchQuery !== prevProps.searchQuery
      || this.props.books !== prevProps.books) {
      this.getData();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <>
        {this.state.clubs.length === 0 ?
          <p>There are no clubs for this search query.</p>
          :
          <CardDeck className="groups-list-container">
            {
              this.state.clubs.map(club =>
                <ClubGridItem key={club.id} club={club} />)
            }
            {
            this.state.clubs.forEach(club => {
              console.log("clubid", club.id)
              
        })}
            
          </CardDeck>
        }
      </>
    );
  }
}