import React from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap';

const popoutDescription = (book) => {
  let description = book.description;
  if (description.length > 500) {
    description = description.substring(0, 500).concat('...');
  }

  return (
    <Popover>
      <Popover.Title as='h3'>
        <a className='center-horizontal'
          href={`/bookpage/${book.id}`} target='_blank'
          rel='noopener noreferrer'>
          {book.title}
        </a>
      </Popover.Title>
      <Popover.Content>
        <p className='font-weight-bold'>Description:</p>
        {description}
      </Popover.Content>
    </Popover >
  );
}

const BookDescriptionOverlay = (props) => {
  return (
    <OverlayTrigger trigger='hover' placement='right' overlay={popoutDescription(props.book)}>
      {props.children}
    </OverlayTrigger>
  );
}

export { BookDescriptionOverlay };