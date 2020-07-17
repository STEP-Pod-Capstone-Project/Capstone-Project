import React, { Component } from 'react';
import { Button, Spinner, Row, Col } from 'react-bootstrap'
import StarRatings from 'react-star-ratings'

class ListPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      bookList: {},
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
      this.setState({ loading: false, empty: true, bookList: bookList[0] });
      return;
    }

    const gBooks = [];

    await Promise.all(gbookIDs.map(async (gBookID) => {
      const gBook = await fetch(`/api/search?gbookId=${gBookID}`).then(response => response.json())
      gBooks.push(gBook[0]);
    }))

    this.setState({ bookList: bookList[0], gBooks, loading: false });

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
        (
          <div>
            <h2 className="mt-3">{this.state.bookList.name}</h2>
            <hr style={{ border: "1px solid #ccc" }} />
            <h3 className="text-center mt-4">Booklist has No Books</h3>
          </div>
        )
        : (
          <div>
            <h2 className="mt-3">{this.state.bookList.name}</h2>
            <hr style={{ border: "1px solid #ccc" }} />

            <div>
              {
                this.state.gBooks.map(gBook =>
                  <Row className="text-center border m-5 bg-light" key={gBook.id + this.props.match.params.id} style={{ border: "1px solid #ccc" }}>
                    <Col md={3} className="my-4 p-0 ">
                      <a className="text-decoration-none text-body" href={gBook.canonicalVolumeLink}>
                        <img className="img-responsive" src={gBook.thumbnailLink} alt={gBook.title} />
                      </a>
                    </Col>

                    <Col className="my-4 p-0">
                      <h2 className="mt-4"> {gBook.title} </h2>
                      <StarRatings
                        rating={gBook.avgRating}
                        starDimension="40px"
                        starSpacing="10px"
                        starRatedColor="gold" />
                        <p className="my-3" > {gBook.authors.join(', ')} </p>
                    </Col>

                    <Col md={3} className="my-4 p-0">
                      <a className="btn btn-primary mt-5" href={gBook.webReaderLink}>Web Reader</a>
                      <br />
                      <Button className="my-4" variant="danger" onClick={() => this.deleteBook(gBook.id)}>
                        Remove Book from List
                      </Button>
                    </Col>

                  </Row>)
              }
            </div>

          </div >)
      );
  }
}

export default ListPage;