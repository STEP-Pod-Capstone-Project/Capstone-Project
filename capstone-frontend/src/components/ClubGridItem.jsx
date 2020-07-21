import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import '../styles/Groups.css';

const ClubGridItem = ({club}) => {
  const header = club.ownerID === window.localStorage.getItem("userID") ?
                     <Card.Header className="header text-muted"> Owner </Card.Header> :
                     <Card.Header className="header text-muted"> Member </Card.Header>;
  return (
    <Card className="col-3 group-container">
      <Link id="group-link" to={`/clubpage/${club.id}`}>
        {header}
        <Card.Body>
          <Card.Title id="group-name"> {club.name} </Card.Title>
          <Card.Subtitle className="mb-2 text-muted" id="group-gbook"> Reading: {club.bookTitle} </Card.Subtitle>
          <Card.Text id="group-description"> {club.description} </Card.Text>
        </Card.Body>
        <Card.Footer className="text-muted"> {club.memberIDs.length} Members </Card.Footer>
      </Link>
    </Card>
  );
};

export default ClubGridItem;