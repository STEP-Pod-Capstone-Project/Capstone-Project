import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import { LeftSideBar } from './components/LeftSideBar';


const container = document.createElement("div");
document.body.appendChild(container);

const getUserBookLists = () => {
  return [
    { id: '1', name: 'Best Books' },
    { id: '2', name: 'Fantasy' },
    { id: '3', name: 'Sci-fi' }
  ];
};

test('renders left sidebar and navbar', () => {
  render(<Router><LeftSideBar bookLists={getUserBookLists()} /></Router>, container);

  const leftSidebarNavbar = document.getElementById("left-sidebar-navbar"); 
  expect(leftSidebarNavbar).toBeInTheDocument();
});

// Commented out for now.
// At the moment we still don't have a Friends feature so the RightSideBar is not nessesary.
// The current RightSideBar.jsx is just a template. 

// test('renders right sidebar', () => {
//   render(<Router><RightSideBar />}/></Router>, container);
//   const rightSidebar = document.getElementById("right-sidebar-container");
//   expect(rightSidebar).toBeInTheDocument();
// });
