import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

var container = document.createElement("div");
document.body.appendChild(container);

test('renders sidebar', () => {
 render(<App />, container);
  const leftSidebar = document.getElementById("left-sidebar-container");
  expect(leftSidebar).toBeInTheDocument();
  const rightSidebar = document.getElementById("right-sidebar-container");
  expect(rightSidebar).toBeInTheDocument();
  const navbar = document.getElementById("navbar");
  expect(navbar).toBeInTheDocument();
});
