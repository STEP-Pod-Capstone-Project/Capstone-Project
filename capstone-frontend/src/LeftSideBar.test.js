import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { LeftSideBar } from "./components/LeftSideBar.jsx";
import { BrowserRouter as Router } from 'react-router-dom'; 

const container = document.createElement("div");
document.body.appendChild(container);

const getUserBookLists = () => {
  return [
    { id: '1', name: 'Best Books' },
    { id: '2', name: 'Fantasy' },
    { id: '3', name: 'Sci-fi' }
  ];
};

const getUserCollabBookLists = () => {
  return [
    { id: '4', name: 'Mauro Books' },
    { id: '5', name: 'Star Wars' },
    { id: '6', name: 'Non-Fiction' }
  ];
};

test('renders sidebar test', () => {
  render(<Router> <LeftSideBar bookLists={getUserBookLists()} collabBookLists={getUserCollabBookLists()} /> </Router>, container);

  const homeLink = document.getElementById("home-link");
  expect(homeLink).toBeInTheDocument();

  const browseLink = document.getElementById("browse-link");
  expect(browseLink).toBeInTheDocument();

  const myBooksLink = document.getElementById("mybooks-link");
  expect(myBooksLink).toBeInTheDocument();

  const myListsLink = document.getElementById("mylists-link");
  expect(myListsLink).toBeInTheDocument();

  const createBookListBtn = document.getElementById("create-list-modal");
  expect(createBookListBtn).toBeInTheDocument();
  expect(createBookListBtn.innerHTML).toMatch(/Create New List/);

  const myClubsLink = document.getElementById("myclubs-link");
  expect(myClubsLink).toBeInTheDocument();
}); 