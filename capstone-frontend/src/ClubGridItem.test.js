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
  ownerID: "ownerID",
  gbookID: "gbookID"
};

test('renders club tile test', () => {
  render(<Router> <ClubGridItem name={club.name} description={club.description} ownerID={club.ownerID} gbookID={club.gbookID} /> </Router>, container);

  const name = document.getElementById("group-name");
  expect(name).toBeInTheDocument();

  const description = document.getElementById("group-description");
  expect(description).toBeInTheDocument();

  const ownerID = document.getElementById("group-ownerID");
  expect(ownerID).toBeInTheDocument();

  const gbookID = document.getElementById("group-gbookID");
  expect(gbookID).toBeInTheDocument();

  const link = document.getElementById("group-link");
  expect(link).toBeInTheDocument();

});  