import React from "react";
import ReactDOM from 'react-dom';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import LeftSideBar from "./components/LeftSideBar.jsx";
import App from "./App.jsx";
import {
  Route, 
  BrowserRouter as Router, 
  Link
} from 'react-router-dom'; 

const container = document.createElement("div");
document.body.appendChild(container);

test('renders sidebar test', () => {
  render(<Router> <LeftSideBar /> </Router>, container);

  const homeLink = document.getElementById("home-link");
  expect(homeLink).toBeInTheDocument();

  const browseLink = document.getElementById("browse-link");
  expect(browseLink).toBeInTheDocument();

  const myBooksLink = document.getElementById("mybooks-link");
  expect(myBooksLink).toBeInTheDocument();

  const myListsLink = document.getElementById("mylists-link");
  expect(myListsLink).toBeInTheDocument();

  const myClubsLink = document.getElementById("myclubs-link");
  expect(myClubsLink).toBeInTheDocument();
}); 