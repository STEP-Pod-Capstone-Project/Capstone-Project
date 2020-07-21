import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react/';
import LeftSideBar from './components/LeftSideBar';
import Navbar from './components/Navbar';
import RightSideBar from './components/RightSideBar';


const container = document.createElement("div");
document.body.appendChild(container);

const getUserBookLists = () => {
  return [
    { id: '1', name: 'Best Books' },
    { id: '2', name: 'Fantasy' },
    { id: '3', name: 'Sci-fi' }
  ];
  ;
}


test('renders left sidebar', () => {
  render(<Router><LeftSideBar bookLists={getUserBookLists()} /></Router>, container);

  const leftSidebar = document.getElementById("left-sidebar-container"); expect(leftSidebar).toBeInTheDocument();
});

test('renders right sidebar', () => {
  render(<Router><RightSideBar />}/></Router>, container);
  const rightSidebar = document.getElementById("right-sidebar-container");
  expect(rightSidebar).toBeInTheDocument();
});

test('renders nav', () => {
  render(<Router><Navbar testing={true}/></Router>, container);
  const navbar = document.getElementById("navbar");
  expect(navbar).toBeInTheDocument();
});