import React, { Component } from 'react';
import { Button, Spinner } from 'react-bootstrap'

class ListPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      gBooks: [],
      loading: true,
      empty: false
    }
  }


  fetchBooks = async () => {

    const bookList = await fetch(`/api/booklist?id=${this.props.match.params.id}`, {
      method: "GET",
    }).then(resp => resp.json());

    const gbookIDs = bookList[0].gbookIDs;

    if (!gbookIDs.length) {
      this.setState({ loading: false, empty: true });
      return;
    }

    const gBooks = [];

    await Promise.all(gbookIDs.map(async (gBookID) => {
      const gBook = await fetch(`/api/search?gbookId=${gBookID}`).then(response => response.json())
      gBooks.push(gBook[0]);
    }))

    this.setState({ gBooks, loading: false });
  }

  componentDidMount() {
    this.fetchBooks();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.setState({ loading: true, empty: false })
      this.fetchBooks();
    }
  }

  deleteBook = (bookId) => {

    const bookListUpdateJson = {
      "id": this.props.match.params.id,
      "remove_gbookIDs": bookId,
    }

    // Update BookList in Firebase
    fetch("/api/booklist", {
      method: "PUT",
      body: JSON.stringify(bookListUpdateJson)
    });

    this.fetchBooks();
  }

  render() {
    return this.state.loading
      ?
      (<div className="text-center mt-4">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
        <br />
        <h1>Loading...</h1>
      </div>)
      :
      (this.state.empty
        ?
        (<h1 className="text-center mt-4">Booklist has No Books</h1>)
        : (
          <div className="text-center mt-4">
            {
              this.state.gBooks.map(gBook =>
                <div key={gBook.id + this.props.match.params.id}>
                  <a className="text-decoration-none text-body" href={gBook.canonicalVolumeLink}>
                    <div>
                      <img src={gBook.thumbnailLink} alt={gBook.title} />
                      <br />
                      <h2 > {gBook.title} </h2>
                      <p > {gBook.authors.join(', ')} </p>
                    </div>
                  </a>
                  <a className="btn btn-primary" href={gBook.webReaderLink}>Web Reader</a>
                  <br />
                  <br />
                  <Button variant="danger" onClick={() => this.deleteBook(gBook.id)}>
                    Remove Book from List
              </Button>
                  <br />
                  <br />
                </div>
              )
            }
          </div>
        ));
  }
}

export default ListPage;