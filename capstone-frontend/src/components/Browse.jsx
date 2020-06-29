import React from 'react';
import BookSearchList from './BookSearchList';

const Browse = (props) => {
  return (
    <BookSearchList searchQuery={props.match.params.query} key={props.match.params.query}/>
  );
}

export default Browse;