import React from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import '../styles/Book.css';

const addBookToBookList = async (bookId, bookListJson) => {

  const bookListUpdateJson = {
    "id": bookListJson.id,
    "add_gbookIDs": bookId,
  }

  // Update BookList in Firebase
  fetch("/api/booklist", {
    method: "PUT",
    body: JSON.stringify(bookListUpdateJson)
  });
}

const BookListAddDropdown = ({ book, userBookLists }) => {
  if (userBookLists.length > 0) {
    return (
      <DropdownButton id="dropdown-list-add" className="btn-margin center-horizontal" title="Add to List">
        {
          userBookLists.map(bookList =>
            <Dropdown.Item key={bookList.id}
              onSelect={() => addBookToBookList(book.id, bookList.id)}>
              {bookList.name}
            </Dropdown.Item>
          )
        }
      </DropdownButton>
    );
  } else {
    return (
      <DropdownButton id="dropdown-list-add" className="btn-margin center-horizontal" title="No Lists Found" variant="warning">
        {
          <Dropdown.Item href="/createlist">
            <span> Create New List </span>
          </Dropdown.Item>
        }
      </DropdownButton>
    );
  }
}

export default BookListAddDropdown;