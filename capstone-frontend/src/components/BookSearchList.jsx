import React from 'react';
import '../App.css';

import BookSearchTile from './BookSearchTile';

const BookSearchList = ({ books, bookLists, updateBookLists }) => {
  return (
    <div>
      {books &&
        books.map(book =>
          <BookSearchTile book={book} bookLists={bookLists} updateBookLists={updateBookLists} key={book.id} />
        )
      }
    </div>
  );
}

export { BookSearchList };