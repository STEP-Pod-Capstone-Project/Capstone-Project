import React from 'react';
import { Link } from 'react-router-dom';

import '../styles/Groups.css';

const ClubGridItem = ({id, name, description, ownerID, gbookID}) => {
  return (
    <div className="col-3 group-container">
      <Link id="group-link" to={`/clubpage/${id}`}>
        <div id="group-name"> {name} </div>
        <div id="group-description"> {description} </div>
        <div id="group-ownerID"> {ownerID} </div>
        <div id="group-gbookID"> {gbookID} </div>
      </Link>
    </div>
  );
};

export default ClubGridItem;