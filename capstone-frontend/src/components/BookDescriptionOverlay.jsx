import React from 'react';
import { Link } from 'react-router-dom';
import { Popover, OverlayTrigger } from 'react-bootstrap';

// Considered making this a stateless functional component used in the Overlay component.
// When referenced as a component in the overlay prop, the Popover always appears at the
// top left of the screen even when there is a predefined placement.
const popoutDescription = (book) => {
  let description = (typeof book !== 'undefined') ? book.description : "";

  if (description.length > 500) {
    description = description.substring(0, 500).concat('...');
  }

  return (
    <Popover>
      <Popover.Title as='h3'>
        <Link to={`/bookpage/${book.id}`} className='center-horizontal'
          target='_blank' rel='noopener noreferrer'>
          {book.title}
        </Link>
      </Popover.Title>
      {description &&
        <Popover.Content>
          <p className='font-weight-bold'>Description:</p>
          {description}
        </Popover.Content>
      }
    </Popover>
  );
}

const BookDescriptionOverlay = (props) => {
  return (
    <>
      {props.book &&
        <OverlayTrigger trigger='click' placement='auto' overlay={popoutDescription(props.book)}>
          {props.children}
        </OverlayTrigger>
      }
    </>
  );
}

export { BookDescriptionOverlay };