import React from 'react';
import BookSearchList from './BookSearchList';

const Browse = (props) => {
  return (
    <BookSearchList key={props.match.params.query}/>
  );
}

export default Browse;