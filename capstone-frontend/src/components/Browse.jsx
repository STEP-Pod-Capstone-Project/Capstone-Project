import React from 'react';
import BookSearchList from './BookSearchList';

const Browse = (props) => {
  return (
    <BookSearchList searchQuery={props.searchQuery} key={props.searchQuery} bookLists={props.bookLists} updateBookLists={props.updateBookLists} />
  );
}

export default Browse;