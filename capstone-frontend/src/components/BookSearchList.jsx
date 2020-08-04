import React from 'react';
import '../App.css';

import BookSearchTile from './BookSearchTile';

const BookSearchList = ({ books, bookLists, updateBookLists }) => {
  return (books.length === 0 ?
    <p>There are no books for this search query.</p>
    :
    books.map(book =>
      <BookSearchTile
        book={book}
        bookLists={bookLists}
        updateBookLists={updateBookLists}
        key={book.id} />
    )
  );
}

export { BookSearchList };