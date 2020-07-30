import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { CardDeck, Tabs, Tab, Card } from 'react-bootstrap';
import ClubGridItem from './ClubGridItem.jsx'
import { BookDescriptionOverlay } from "./BookDescriptionOverlay";
import '../App.css';
import '../styles/Home.css'

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      clubs: [],
      myBookListsMap: new Map(),
      sharedBookListsMap: new Map(),
      key: 'Booklists', // For Bootstrap Tabs
      screenWidth: window.outerWidth,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize);
    this.fetchClubs();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  componentDidUpdate(prevProps) {

    if (this.props.bookLists.length !== prevProps.bookLists.length) {
      this.fetchBookListsImages(this.props.bookLists, 'own');
    }

    if (this.props.collabBookLists.length !== prevProps.collabBookLists.length) {
      this.fetchBookListsImages(this.props.collabBookLists, 'shared');
    }
  }

  resize = () => {
    this.setState({ screenWidth: window.outerWidth });

    this.fetchBookListsImages(this.props.bookLists, 'own');
    this.fetchBookListsImages(this.props.collabBookLists, 'shared');
  }

  fetchClubs = async () => {

    const userID = window.localStorage.getItem('userID');

    const clubsOwner = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/clubs?ownerID=${userID}`).then(resp => resp.json());

    const clubsMember = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/clubs?memberIDs=${userID}`).then(resp => resp.json());

    const clubs = [...clubsOwner, ...clubsMember];

    this.setState({ clubs });
  }

  fetchBookListsImages = async (bookLists, type) => {

    let bookListsMap = new Map();

    await Promise.all(bookLists.map(async bookList => {

      if (bookList.gbookIDs.length === 0) {
        bookListsMap.set(bookList, [])
        return;
      }

      let gBooks = [];
      let bookIDs;

      // Reduce to one element if on mobile
      if (this.state.screenWidth <= 425) {
        bookIDs = bookList.gbookIDs.slice(0, 1);
      }
      // Reduce to three elements if on table
      else if (this.state.screenWidth >= 426 && this.state.screenWidth <= 768) {
        bookIDs = bookList.gbookIDs.slice(0, 3);
      }
      // Reduce to six elements
      else {
        bookIDs = bookList.gbookIDs.slice(0, 6);
      }

      await Promise.all(bookIDs.map(async gBookId => {

        const gBook = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/search?gbookId=${gBookId}`).then(resp => resp.json());

        gBooks.push(gBook[0]);
      }));

      bookListsMap.set(bookList, gBooks);
    }))

    if (type === 'own') {
      this.setState({ myBookListsMap: bookListsMap });
    }
    else if (type === 'shared') {
      this.setState({ sharedBookListsMap: bookListsMap });
    }
  }


  render() {
    return (
      <div>

        <Tabs
          activeKey={this.state.key}
          onSelect={(key) => this.setState({ key })} >

          <Tab eventKey="Clubs" title="Clubs">
            <CardDeck className='groups-list-container'>
              {this.state.clubs.map(club =>
                <ClubGridItem key={club.id} club={club} />)}
            </CardDeck>
          </Tab>

          <Tab eventKey="Booklists" title="Booklists">

            {[...this.state.myBookListsMap.keys()].map(bookList => {

              const books = this.state.myBookListsMap.get(bookList);

              return (
                <Card key={bookList.id} className="m-4">

                  <Link to={`/listpage/${bookList.id}`}>
                    <Card.Header>
                      <Card.Title id='booklist-card-font-size-title' className='text-muted'>{bookList.name}</Card.Title>
                    </Card.Header>
                  </Link>

                  {books.length !== 0
                    ?
                    <div id='booklist-content' className='m-auto'>
                      {books.map(book =>
                        <Card.Body key={book.id} >
                          <BookDescriptionOverlay book={book}>
                            <Card.Img className='img-fluid my-1 light-gray-border book-img-lg' variant='top' src={book.thumbnailLink} />
                          </BookDescriptionOverlay>
                          <Card.Title id='booklist-card-book-title-font-size' className='mt-4 mb-1 text-center book-img-text-width'>{book.title}</Card.Title>
                        </Card.Body>)}
                    </div>
                    :
                    <Card.Body>
                      <Card.Text>Booklist contains no books</Card.Text>
                    </Card.Body>}

                  <Card.Footer>
                    <Card.Text id='booklist-card-font-size-footer' className='text-muted'>{bookList.collaboratorsIDs.length} Collaborators</Card.Text>
                  </Card.Footer>
                </Card>
              )
            })}
          </Tab>

          <Tab eventKey="Shared Booklists" title="Shared Booklists" >
            {[...this.state.sharedBookListsMap.keys()].map(bookList => {

              const books = this.state.sharedBookListsMap.get(bookList);

              console.log(bookList, books)

              return (
                <Card key={bookList.id} className="m-4">

                  <Link to={`/listpage/${bookList.id}`}>
                    <Card.Header>
                      <Card.Title id='booklist-card-font-size-title' className='text-muted'>{bookList.name}</Card.Title>
                    </Card.Header>
                  </Link>

                  {books.length !== 0
                    ?
                    <div id='booklist-content' className='m-auto'>
                      {books.map(book =>
                        <Card.Body key={book.id} >
                          <BookDescriptionOverlay book={book}>
                            <Card.Img className='img-fluid my-1 light-gray-border book-img-lg' variant='top' src={book.thumbnailLink} />
                          </BookDescriptionOverlay>
                          <Card.Title id='booklist-card-book-title-font-size' className='mt-4 mb-1 text-center book-img-text-width'>{book.title}</Card.Title>
                        </Card.Body>)}
                    </div>
                    :
                    <Card.Body>
                      <Card.Text>Booklist contains no books</Card.Text>
                    </Card.Body>}

                  <Card.Footer>
                    <Card.Text id='booklist-card-font-size-footer' className='text-muted'>{bookList.collaboratorsIDs.length} Collaborators</Card.Text>
                  </Card.Footer>
                </Card>
              )
            })}
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default Home;