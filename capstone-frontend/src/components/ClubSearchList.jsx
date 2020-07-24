import React from 'react';
import { CardDeck } from 'react-bootstrap';
import FuzzySearch from 'fuzzy-search';
import ClubGridItem from './ClubGridItem';

import '../styles/Groups.css';

const ClubSearchList = (props) => {
  let result = [];
  if (props.clubs) {
    const searcher = new FuzzySearch(props.clubs, ['name', 'description', 'bookTitle'], {
      sort: true,
    });
    result = searcher.search(props.searchQuery);
  }

  let clubArray = [];
  result.forEach(club => {
    console.log("club in array", club);
    clubArray.push(<ClubGridItem key={club.id} club={club} />);
  });

  return (
    <>
      {clubArray.length === 0
        ? <p>There are no clubs for this search query.</p>
        : <CardDeck className="groups-list-container"> {clubArray} </CardDeck>
      }
    </>
  );

}


export { ClubSearchList };