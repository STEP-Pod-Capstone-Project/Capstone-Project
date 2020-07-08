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
  let userBookLists = [{ id: "1", name: "Best Books" },
  { id: "2", name: "Fantasy" },
  { id: "3", name: "Sci-fi" }];
  return userBookLists;
}

const getUserClubs = () => {
  let userClubs = [{ id: "1", name: "Cool Kats Book Club" },
  { id: "2", name: "Sci-fi Fans" }];
  return userClubs;
}

const getUserCommunities = () => {
  let userCommunities = [{ id: "1", name: "Sci-fi Community" },
  { id: "2", name: "Read-a-lot" }];
  return userCommunities;
}

test('renders book search tile test', () => {
  render(<BookSearchTile book={book}
    userBookLists={getUserBookLists()}
    userClubs={getUserClubs()}
    userCommunities={getUserCommunities()} />, container);

  const bookThumbnail = document.getElementsByClassName("book-img-med")[0];
  expect(bookThumbnail).toBeInTheDocument();

  const bookTitle = document.getElementsByTagName("h2")[0];
  expect(bookTitle).toBeInTheDocument();

  const bookAuthor = document.getElementsByTagName("p")[0];
  expect(bookAuthor).toBeInTheDocument();

  const bookListButton = document.getElementById("dropdown-list-add");
  expect(bookListButton).toBeInTheDocument();

  const groupButton = document.getElementById("dropdown-group-add");
  expect(groupButton).toBeInTheDocument();
});