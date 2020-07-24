import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BookListAddDropdown } from './BookListAddDropdown';
import StarRatings from 'react-star-ratings';
import '../styles/Book.css';

export class BookPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      book: {}
    }
  }

  fetchBookData = () => {
    fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/search?gbookId=${this.props.bookId}`)
      .then(response => response.json())
      .then(books => this.setState({ book: books[0] }))
      .catch(function (err) {
        //TODO #61: Frontend error logging
        alert(err);
      });
  }

  componentDidMount() {
    this.fetchBookData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.bookId !== prevProps.bookId) {
      this.fetchBookData();
    }
  }

  render() {
    const book = this.state.book;

    return (
      <div>
        {book.authors &&
          <div className='book-page-tile page-container'>
            <Container>
              <Row className='justify-content-md-center'>
                <Col xs={12} md={4}>
                  <Container>
                    <Row>
                      <a className='text-decoration-none text-body center-horizontal'
                        href={book.canonicalVolumeLink} target='_blank'
                        rel='noopener noreferrer'>
                        <img className='book-img-lg' src={book.thumbnailLink}
                          alt={book.title} />
                      </a>
                    </Row>
                    <Row>
                      <BookListAddDropdown bookLists={this.props.bookLists}
                        updateBookLists={this.props.updateBookLists} book={book} />
                    </Row>
                    <Row>
                      <a className='btn btn-primary btn-margin center-horizontal'
                        href={book.webReaderLink} target='_blank'
                        rel='noopener noreferrer'>
                        Web Reader
                      </a>
                    </Row>
                  </Container>
                </Col>
                <Col md={8}>
                  <Container>
                    <Row>
                      <h2> {book.title} </h2>
                    </Row>
                    <Row>
                      <h4> {book.authors.join(', ')} </h4>
                    </Row>
                    <Row>
                      <StarRatings
                        rating={book.avgRating}
                        starDimension='40px'
                        starSpacing='10px'
                        starRatedColor='gold'
                      />
                      {book.avgRating === 0 && <p id='rating-label'>No Ratings</p>}
                    </Row>
                    <Row>
                      <h3> Description </h3>
                    </Row>
                    <Row>
                      <p className='text-left'> {this.state.book.description} </p>
                    </Row>
                  </Container>
                </Col>
              </Row>
            </Container>
          </div>
        }
      </div>
    );
  }
}