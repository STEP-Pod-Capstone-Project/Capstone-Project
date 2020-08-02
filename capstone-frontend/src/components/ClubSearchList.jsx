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
    // Get clubs by searchQuery
    let clubs = await fetch(`/api/clubs?searchTerm=${this.props.searchQuery}`)
      .then(response => response.json())
      .catch(e => console.log(e));

    // Get clubs by checking to see if any clubs are reading the books found in Google Books API search
    await Promise.all(this.props.books.map(book => {
      return fetch(`/api/clubs?gbookID=${book.id}`)
        .then(response => response.json())
        .then(clubsWithBook => {
          if (clubsWithBook.length > 0) {
            clubs = clubs.concat(clubsWithBook)
          }
        })
        .catch(e => console.log(e));
    }));

    // Fill in book title and club owner for all clubs
    await Promise.all(clubs.map(club => {
      if (club.gbookID.length > 0) {
        return fetch(`/api/search?gbookId=${club.gbookID}`)
          .then(response => response.json())
          .then(book => club.bookTitle = book[0].title)
          .catch(e => console.log(e));
      }
      if (club.ownerID.length > 0) {
        return fetch(`/api/user?id=${club.ownerID}`)
          .then(response => response.json())
          .then(owner => club.ownerName = owner.fullName)
          .catch(e => console.log(e));
      }
      return Promise.resolve();
    }));

    this._isMounted && this.setState({ clubs, loading: false });
  }

  componentDidMount() {
    this._isMounted = true;
    this.setState({ loading: true });
    this.getData();
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
      (<div className='text-center mt-4'>
        <Spinner animation='border' role='status' />
        <br />
        <h1>Loading...</h1>
      </div>)
      :
      this.state.clubs.length === 0 ?
        <p>There are no clubs for this search query.</p>
        :
        <CardDeck className='groups-list-container'>
          {
            this.state.clubs.map(club =>
              <ClubGridItem key={club.id} club={club} />)
          }
        </CardDeck>
    );
  }
}