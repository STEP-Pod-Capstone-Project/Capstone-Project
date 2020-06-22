import React, { Component } from 'react';
import '../App.css';

import BookSearchTile from './BookSearchTile';

class BookSearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookList: []
    }
    this.searchQuery = "Lord of the Flies";
    this.getData = this.getData.bind(this);
  }

  getData() {
    fetch(`https://8080-cs-60845877040-default.us-central1.cloudshell.dev/search?searchTerm={"Lord of the Flies"}`, {method: 'GET', credentials: 'include'})
      .then(res => this.setState({ bookList: res.data }))
      .catch(err => console.log(err));
    console.log(this.bookList);
    // const books = [
    //   { id:1, title:"lotf", author:"goldstein", thumbnailLink:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"},
    //   { id:2, title: "lotF", author:"bluestein", thumbnailLink:"https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"}
    // ];
    // this.setState({ bookList: books });
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    var books = [];
    for (const book of this.state.bookList) {
      console.log(book);
      books.push(<BookSearchTile title={book.title} author={book.author} thumbnailLink={book.thumbnailLink} key={book.id} />);
    }

    return (
      <div>
        {books}
      </div>
    );
  }
}

export default BookSearchList;