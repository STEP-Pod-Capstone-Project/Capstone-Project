import React from 'react';
import { Link } from 'react-router-dom';

import '../styles/Groups.css';

const ClubGridItem = ({id, name, description, ownerID, gbookID}) => {
  return (
    <div className="col-3 group-container">
      <Link id="group-link" to={`/clubpage/${id}`}>
        <div id="group-name"> Name: {name} </div>
        <div id="group-description"> Description: {description} </div>
        <div id="group-ownerID"> OwnerID: {ownerID} </div>
        <div id="group-gbookID"> GbookID: {gbookID} </div>
      </Link>
    </div>
  );
};

export default ClubGridItem;