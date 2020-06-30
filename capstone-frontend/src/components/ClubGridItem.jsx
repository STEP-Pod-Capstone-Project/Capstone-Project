import React from 'react';
import { Link } from 'react-router-dom';

import '../styles/Groups.css';

const ClubGridItem = ({id, name, description, ownerID, gbookID}) => {
  return (
    <div className="col-3 group-container">
      <Link to={`/clubpage/${id}`}>
        <div> Name: {name} </div>
        <div> Description: {description} </div>
        <div> OwnerID: {ownerID} </div>
        <div> GbookID: {gbookID} </div>
      </Link>
    </div>
  );
};

export default ClubGridItem;