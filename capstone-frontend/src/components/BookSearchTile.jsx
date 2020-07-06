import React from 'react';
import '../App.css';

const BookSearchTile = (props) => {
  return (
    <div className="book-search-tile">
      <img className="book-img-med" src={props.thumbnailLink} alt={props.title}/>
      <div>
        <div className="book-title"> {props.title} </div>
        <div className="book-author"> {props.author.join()} </div>
      </div>
    </div>
  );
}

export default BookSearchTile;