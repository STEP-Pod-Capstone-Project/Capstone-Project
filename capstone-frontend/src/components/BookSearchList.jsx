import React, { Component } from 'react';
import '../App.css';

import BookSearchTile from './BookSearchTile';

class BookSearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookList: []
    }
  }

  getData = () => {
    fetch(`/api/search?searchTerm=${this.props.searchQuery}`)
      .then(response => response.json())
      .then(res => this.setState({ bookList: res }))
      .catch(err => console.log(err));
  }

  getUserBookLists = () => {
    let userBookLists = [{ id:"1", name:"Best Books" },
                         { id:"2", name:"Fantasy" },
                         { id:"3", name:"Sci-fi" }];
    return userBookLists;
  }

  getUserClubs = () => {
    let userClubs =  [{ id:"1", name:"Cool Kats Book Club" },
                      { id:"2", name:"Sci-fi Fans"}];
    return userClubs;
  }

  getUserCommunities = () => {
    let userCommunities = [{ id:"1", name:"Sci-fi Community" },
                           { id:"2", name:"Read-a-lot" }];
    return userCommunities;
  }

  componentDidMount() {
    this.getData();
    this.setState({ userBookLists: this.getUserBookLists() });
    this.setState({ userClubs: this.getUserClubs() });
    this.setState({ userCommunities: this.getUserCommunities() });
  }

  render() {
    var books = [];
    for (const book of this.state.bookList) {
      books.push(<BookSearchTile title={book.title}
        author={book.authors} thumbnailLink={book.thumbnailLink}
        userBookLists={this.state.userBookLists}
        userClubs={this.state.userClubs}
        userCommunities={this.state.userCommunities}
        id={book.id}
        key={book.id} />);
    }

    return (
      <div>
        {books}
      </div>
    );
  }
}

export default BookSearchList;