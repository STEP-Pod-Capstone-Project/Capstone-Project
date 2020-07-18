import React from "react";
import ReactDOM from 'react-dom';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import BookSearchTile from "./components/BookSearchTile.jsx";
import App from "./App.jsx";
import {
  Route,
  BrowserRouter as Router,
  Link
} from 'react-router-dom';

const container = document.createElement("div");
document.body.appendChild(container);
const book = {
  title: "Title",
  authors: ["Author"],
  thumbnailLink: "https://http.cat/100.jpg"
};
const getUserBookLists = () => {
  return [{ id: "1", name: "Best Books" },
  { id: "2", name: "Fantasy" },
  { id: "3", name: "Sci-fi" }];
}

const emptyArray = [];

test('renders book search tile test', () => {
  render(<BookSearchTile book={book}
    bookLists={getUserBookLists()} />, container);

  const bookThumbnail = document.getElementsByClassName("book-img-med")[0];
  expect(bookThumbnail).toBeInTheDocument();

  const bookTitle = document.getElementsByClassName("book-title")[0];
  expect(bookTitle).toBeInTheDocument();

  const bookAuthor = document.getElementsByClassName("book-authors")[0];
  expect(bookAuthor).toBeInTheDocument();

  const bookListButton = document.getElementById("dropdown-list-add");
  expect(bookListButton).toBeInTheDocument();
  expect(bookListButton.innerHTML).toEqual("Add to List");


});

test('renders book search tile with empty bookList test', () => {
  render(<BookSearchTile book={book}
    bookLists={emptyArray} />, container);

  const bookListButton = document.getElementById("dropdown-list-add");
  expect(bookListButton).toBeInTheDocument();
  expect(bookListButton.innerHTML).toEqual("No Lists Found");
});

test('renders bookSearchTile createList btn', () => {
  render(<App />, container);

  const createBookListBtn = document.getElementById("create-list-modal");
  expect(createBookListBtn).toBeInTheDocument();
  expect(createBookListBtn.innerHTML).toEqual(" Create New List ");
});

