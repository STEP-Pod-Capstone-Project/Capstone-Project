import React from 'react';
import ReactDOM from 'react-dom';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import BookSearchTile from './components/BookSearchTile.jsx';
import CreateList from './components/CreateList.jsx'
import { BrowserRouter as Router } from 'react-router-dom';

const container = document.createElement('div');
document.body.appendChild(container);
const book = {
  title: 'Title',
  authors: ['Author'],
  thumbnailLink: 'https://http.cat/100.jpg',
  description: 'description',
};
const getUserBookLists = () => {
  return [{ id: '1', name: 'Best Books' },
  { id: '2', name: 'Fantasy' },
  { id: '3', name: 'Sci-fi' }];
}

const emptyArray = [];

test('renders book search tile test', async () => {
  render(<Router><BookSearchTile book={book} location={'search'}
    bookLists={getUserBookLists()} /></Router>, container);

  const bookThumbnail = document.getElementsByClassName('book-img-md')[0];
  expect(bookThumbnail).toBeInTheDocument();

  const bookTitle = document.getElementById('book-title');
  expect(bookTitle).toBeInTheDocument();

  const bookAuthor = document.getElementById('book-authors');
  expect(bookAuthor).toBeInTheDocument();

  const bookListButton = document.getElementById('button-list-add');
  expect(bookListButton).toBeInTheDocument();
  expect(bookListButton.innerHTML).toEqual('Add to List');

  await act(async () => { bookListButton.click() });
  const dropdownItems = document.getElementsByClassName('dropdown-item');
  expect(dropdownItems.length).toEqual(3);
  expect(dropdownItems[0].innerHTML).toMatch(/Best Books/);
});

test('renders book search tile with empty bookList test', () => {
  render(<Router><BookSearchTile book={book}
    bookLists={emptyArray} /></Router>, container);

  const bookListButtons = document.getElementsByTagName('button')[0].className;
  expect(bookListButtons).toMatch(/btn-success/);
});

test('renders bookSearchTile createList btn', () => {
  render(<Router><CreateList bookLists={getUserBookLists()} /></Router>, container);

  const createBookListBtn = document.getElementById('create-list-modal');
  expect(createBookListBtn).toBeInTheDocument();
  expect(createBookListBtn.innerHTML).toMatch(/ Create New BookList /);
});
