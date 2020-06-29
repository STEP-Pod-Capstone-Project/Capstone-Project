import React from 'react';
import { Link } from 'react-router-dom';

import '../styles/Clubs.css';

const ClubGridItem = ({id, name, description, ownerID, gbookID}) => {
  return (
    <div className="col-3 club-container">
      <Link to={`/clubpage/${id}`}>
        <div> {name} </div>
        <div> {description} </div>
        <div> {ownerID} </div>
        <div> {gbookID} </div>
      </Link>
    </div>
  );
};

export default ClubGridItem;