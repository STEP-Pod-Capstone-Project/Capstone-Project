import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { LeftSideBar } from './components/LeftSideBar';
import { RightSideBar } from './components/RightSideBar';


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
}

test('renders left sidebar and navbar', () => {
  render(<Router><LeftSideBar
    bookLists={getUserBookLists()}
    collabBookLists={getUserCollabBookLists()}
    friendsList={getUserFriendsList()}
  /></Router>, container);

  const leftSidebarNavbar = document.getElementById('left-sidebar-navbar');
  expect(leftSidebarNavbar).toBeInTheDocument();
});

test('renders right sidebar', () => {
  render(<Router><RightSideBar friendsList={getUserFriendsList()} />}/></Router>, container);
  const rightSidebar = document.getElementById('right-sidebar-container');
  expect(rightSidebar).toBeInTheDocument();
});
