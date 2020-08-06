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

const getUserFriendsList = () => {
  return [
    { id: '7', fullName: 'Mauro Guerrero', email: 'mauroguerrero@google.com', profileImageUrl: 'mauro.com/mauro.jpg'},
    { id: '8', fullName: 'Antonio Linhart', email: 'antoniolinhart@google.com', profileImageUrl: 'antonio.com/antonio.jpg'},
    { id: '9', fullName: 'Steven Solar', email: 'stevensolar@google.com', profileImageUrl: 'steven.com/steven.jpg'},
  ];
};

test('renders sidebar test', () => {
  render(<Router> <LeftSideBar
    bookLists={getUserBookLists()}
    collabBookLists={getUserCollabBookLists()}
    friendsList={getUserFriendsList()}
  /> </Router>, container);

  const homeLink = document.getElementById("home-link");
  expect(homeLink).toBeInTheDocument();

  const myBooksLink = document.getElementById("mybooks-link");
  expect(myBooksLink).toBeInTheDocument();

  const myListsLink = document.getElementById("mylists-link");
  expect(myListsLink).toBeInTheDocument();

  const myClubsLink = document.getElementById("myclubs-link");
  expect(myClubsLink).toBeInTheDocument();
}); 