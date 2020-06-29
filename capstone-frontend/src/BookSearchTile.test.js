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
  author: ["Author"],
  thumbnailLink: "https://http.cat/100.jpg"
};

test('renders book search tile test', () => {
  render(<BookSearchTile title={book.title} author={book.author} thumbnailLink={book.thumbnailLink} />, container);

  const bookThumbnail = document.getElementsByClassName("book-img-med")[0];
  expect(bookThumbnail).toBeInTheDocument();

  const bookTitle = document.getElementsByClassName("book-title")[0];
  expect(bookTitle).toBeInTheDocument();

  const bookAuthor = document.getElementsByClassName("book-author")[0];
  expect(bookAuthor).toBeInTheDocument();
}); 