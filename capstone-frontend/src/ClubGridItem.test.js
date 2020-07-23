import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import {
  Route, 
  BrowserRouter as Router, 
  Link
} from 'react-router-dom'; 

import ClubGridItem from "./components/ClubGridItem";
import App from "./App.jsx";


const container = document.createElement("div");
document.body.appendChild(container);
const club = {
  name: "name",
  description: "description",
  gbook: "gbook", 
  memberIDs: ["one", "two", "three"], 
  requestIDs: ["four", "five"],
};

test('renders club tile test', () => {
  render(<Router> <ClubGridItem club={club} /> </Router>, container);

  const name = document.getElementById("group-name");
  expect(name).toBeInTheDocument();

  const description = document.getElementById("group-description");
  expect(description).toBeInTheDocument();

  const gbook = document.getElementById("group-gbook");
  expect(gbook).toBeInTheDocument();

  const link = document.getElementById("group-link");
  expect(link).toBeInTheDocument();

});  