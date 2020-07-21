import React from 'react';
import { render } from '@testing-library/react/';
import ShallowRenderer from 'react-test-renderer/shallow';
import App from './App';

const container = document.createElement("div");
document.body.appendChild(container);

test('renders sidebar', () => {
  const AppComp = new ShallowRenderer(<App />);
  AppComp.({isSignIn: true})
 render(AppComp, container);

  const leftSidebar = document.getElementById("left-sidebar-container");
  expect(leftSidebar).toBeInTheDocument();
  const rightSidebar = document.getElementById("right-sidebar-container");
  expect(rightSidebar).toBeInTheDocument();
  const navbar = document.getElementById("navbar");
  expect(navbar).toBeInTheDocument();
});
