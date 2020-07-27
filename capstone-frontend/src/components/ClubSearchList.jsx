import React, { Component } from 'react';
import { CardDeck, Spinner } from 'react-bootstrap';
import ClubGridItem from './ClubGridItem';

import '../styles/Groups.css';

export class ClubSearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clubs: [],
      loading: true,
    }
  }

  getData = async () => {
    console.log(this.state.loading);
    // Get clubs by searchQuery
    let clubs = await fetch(`https://8080-c0019ecb-52af-4655-945f-b5a74df1e54b.ws-us02.gitpod.io/api/clubSearch?searchTerm=${this.props.searchQuery}`)
      .then(response => response.json())
      .catch(err => alert(err));

    // Get clubs by checking to see if any clubs are reading the books found in Google Books API search
    await Promise.all(this.props.books.map(async (book) => {
      const clubsWithBook = await fetch(`https://8080-c0019ecb-52af-4655-945f-b5a74df1e54b.ws-us02.gitpod.io/api/clubs?gbookID=${book.id}`)
        .then(response => response.json())
        .catch(err => alert(err));
      if (clubsWithBook.length > 0) {
        clubs = [...clubs, clubsWithBook];
      }
    }));
    clubs = clubs.flat();

    // Fill in book title and club owner for all clubs
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

    this._isMounted && this.setState({ clubs, loading: false });
  }

  componentDidMount() {
    this._isMounted = true;

    if (this._isMounted) {
      this.setState({ loading: true });
      this.getData();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.searchQuery !== prevProps.searchQuery
      || this.props.books !== prevProps.books) {
        this.setState({ loading: true })
      this.getData();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (this.state.loading
      ?
      (<div className="text-center mt-4">
        <Spinner animation="border" role="status" />
        <br />
        <h1>Loading...</h1>
      </div>)
      :
      <>
        {this.state.clubs.length === 0 ?
          <p>There are no clubs for this search query.</p>
          :
          <CardDeck className="groups-list-container">
            {
              this.state.clubs.map(club =>
                <ClubGridItem key={club.id} club={club} />)
            }
          </CardDeck>
        }
      </>
    );
  }
}