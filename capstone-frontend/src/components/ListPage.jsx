import React, { Component } from 'react';

class ListPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      gBooks: []
    }
  }


  fetchBooks = async () => {

    const userID = window.sessionStorage.getItem("userID");

    const bookLists = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/booklist?userID=${userID}`, {
      method: "GET",
    }).then(resp => resp.json());

    const bookList = Array.from(bookLists).filter(bookList => (bookList.id === this.props.match.params.id))[0].gbookIDs;

    const gBooks = [];

    await Promise.all(bookList.map(async (gBookID) => {
      const gBook = await fetch(`https://www.googleapis.com/books/v1/volumes/${gBookID}`).then(response => response.json())
      gBooks.push(gBook);
    }))

    this.setState({ gBooks });
  }

  componentDidMount() {
    this.fetchBooks();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.fetchBooks();
    }
  }

  convertToHttps = (imgURL) => {
    return imgURL.slice(0, 4) + "s" + imgURL.slice(4);
  }

  render() {
    return (
      <div className="text-center">
        {
          this.state.gBooks.map(gBook =>
            <div key={gBook.id + Math.random().toString(36).substr(2, 9)}>
              <img src={this.convertToHttps(gBook.volumeInfo.imageLinks.thumbnail)} alt={gBook.volumeInfo.title} />
              <br/>
              <h2 > {gBook.volumeInfo.title} </h2>
              <p > {gBook.volumeInfo.authors.join(', ')} </p>
            </div>
          )
        }


      </div>
    );
  }
}

export default ListPage;