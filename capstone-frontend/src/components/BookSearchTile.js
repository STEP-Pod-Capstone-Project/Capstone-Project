import React, { Component } from 'react';
import '../App.css';

class BookSearchTile extends Component {
  render() {
    return (
      <div className="book-search-tile">
        <img className="book-img-med" src={this.props.thumbnailLink} alt={this.props.title}/>
        <div>
          <div className="title"> {this.props.title} </div>
          <div className="author"> {this.props.author.join()} </div>
        </div>
      </div>
    );
  }
}

export default BookSearchTile;