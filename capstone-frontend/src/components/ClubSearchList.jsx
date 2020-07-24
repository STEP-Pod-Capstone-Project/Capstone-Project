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
  }

  getData = async () => {
    let clubs = await fetch(`https://8080-c0019ecb-52af-4655-945f-b5a74df1e54b.ws-us02.gitpod.io/api/clubSearch?searchTerm=${this.props.searchQuery}`)
      .then(response => response.json())
      .catch(err => alert(err));

    await Promise.all(clubs.map(async (club) => {
      if (club.gbookID.length > 0) {
        const book = await fetch(`https://8080-c0019ecb-52af-4655-945f-b5a74df1e54b.ws-us02.gitpod.io/api/search?gbookId=${club.gbookID}`)
          .then(response => response.json());
        club.bookTitle = book[0].title;
      }
    }));

    this.setState({ clubs });
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.searchQuery !== prevProps.searchQuery) {
      this.getData();
    }
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
                <ClubGridItem key={club.toString()} club={club} />)
            }
          </CardDeck>
        }
      </>
    );
  }
}