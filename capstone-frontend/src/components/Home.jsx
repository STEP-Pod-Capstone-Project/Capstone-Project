import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { CardDeck, Tabs, Tab, Card, Spinner, Button } from 'react-bootstrap';
import ClubGridItem from './ClubGridItem.jsx'
import { BookDescriptionOverlay } from "./BookDescriptionOverlay";
import CreateList from './CreateList'
import SearchUserModal from './SearchUserModal'
import '../App.css';
import '../styles/Home.css'

class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      clubsOwned: [],
      clubsMember: [],
      myBookListsMap: new Map(),
      sharedBookListsMap: new Map(),
      key: 'Clubs - Owner', // For Bootstrap Tabs
      screenWidth: window.outerWidth,
      fetchingClubsOwned: true, // For Spinner
      fetchingClubsMember: true, // For Spinner
      fetchingBookListsOwned: true, // For Spinner
      fetchingBookListsShared: true, // For Spinner
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.resize);
    this.fetchClubs('own');
    this.fetchClubs('shared');
    this.fetchBookLists('own');
    this.fetchBookLists('shared');
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    this.setState({ screenWidth: window.outerWidth });

    this.fetchBookLists('own');
    this.fetchBookLists('shared');
  }

  fetchClubs = async (type) => {

    const userID = window.localStorage.getItem('userID');

    if (type === 'own') {
      this.setState({ fetchingClubsOwned: true });
      const clubsOwned = await fetch(`/api/clubs?ownerID=${userID}`).then(resp => resp.json());
      this.setState({ clubsOwned, fetchingClubsOwned: false });
    }
    else if (type = 'shared') {
      this.setState({ fetchingClubsMember: true });
      const clubsMember = await fetch(`/api/clubs?memberIDs=${userID}`).then(resp => resp.json());
      this.setState({ clubsMember, fetchingClubsMember: false });
    }
  }

  fetchBookLists = async (type) => {

    const userID = window.localStorage.getItem('userID');

    let bookLists;

    if (type === 'own') {
      this.setState({ fetchingBookListsOwned: true });

      bookLists = await fetch(`/api/booklist?userID=${userID}`)
        .then(resp => resp.json())
        .catch(err => console.log(err));

      if (typeof bookLists === 'undefined') {
        bookLists = [];
      }
    }
    else if (type === 'shared') {
      this.setState({ fetchingBookListsShared: true });

      bookLists = await fetch(`/api/booklist?collaboratorsIDs=${userID}`)
        .then(resp => resp.json())
        .catch(err => console.log(err));

      if (typeof bookLists === 'undefined') {
        bookLists = [];
      }
    }

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
      // Reduce to five elements
      else {
        bookIDs = bookList.gbookIDs.slice(0, 5);
      }

      await Promise.all(bookIDs.map(async gBookId => {

        const gBook = await fetch(`/api/search?gbookId=${gBookId}`).then(resp => resp.json());

        gBooks.push(gBook[0]);
      }));

      bookListsMap.set(bookList, gBooks);
    }))

    if (type === 'own') {
      this.setState({ myBookListsMap: bookListsMap, fetchingBookListsOwned: false });
    }
    else if (type === 'shared') {
      this.setState({ sharedBookListsMap: bookListsMap, fetchingBookListsShared: false });
    }
  }


  render() {
    return (
      <div>

        <Tabs
          activeKey={this.state.key}
          onSelect={(key) => this.setState({ key })} >

          <Tab eventKey='Clubs - Owner' title='Clubs - Owner'>

            <SearchUserModal
              type='club'
              club={this.state.club}
              text='Search/View Members'
              checkoutText='Current Members'
              btnStyle='btn btn-primary mx-3 h-100' />

            {this.state.fetchingClubsOwned ?
              <div className='text-center mt-4'>
                <Spinner animation='border' role='status' variant='primary' />
              </div>
              :
              <>
                {this.state.clubsOwned.length > 0 ?
                  <CardDeck className='groups-list-container'>
                    {this.state.clubsOwned.map(club =>
                      <ClubGridItem key={club.id} club={club} />)}
                  </CardDeck>
                  :
                  <div className='text-center'>
                    <h3 className=' mt-5'>No Clubs Found</h3>
                    <Link to='/createclub'>
                      <Button className='mt-4' variant='primary'>
                        Create New Club
                    </Button>
                    </Link>
                  </div>}
              </>
            }
          </Tab>

          <Tab eventKey='Clubs - Member' title='Clubs - Member'>

            {this.state.fetchingClubsMember ?
              <div className='text-center mt-4'>
                <Spinner animation='border' role='status' variant='primary' />
              </div>
              :
              <>
                {this.state.clubsMember.length > 0 ?
                  <CardDeck className='groups-list-container'>
                    {this.state.clubsMember.map(club =>
                      <ClubGridItem key={club.id} club={club} />)}
                  </CardDeck>
                  :
                  <div className='text-center'>
                    <h3 className=' mt-5'>No Member Clubs Found</h3>
                  </div>}
              </>
            }
          </Tab>

          <Tab eventKey='Booklists - Owner' title='Booklists - Owner'>

            {this.state.fetchingBookListsOwned ?
              <div className='text-center mt-4'>
                <Spinner animation='border' role='status' variant='primary' />
              </div>
              :
              <>
                {this.state.myBookListsMap.size > 0 ?
                  <>
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
                  </>
                  :
                  <div className='text-center'>
                    <h3 className="mt-5">No Booklists Found</h3>
                    <CreateList updateBookLists={this.props.updateBookLists} btnStyle='btn btn-primary mt-4' />
                  </div>}
              </>
            }
          </Tab>

          <Tab eventKey='Booklists - Collaborator' title='Booklists - Collaborator' >

            {(this.state.fetchingBookListsShared || this.props.fetchingCollabBookLists) ?
              <div className='text-center mt-4'>
                <Spinner animation='border' role='status' variant='primary' />
              </div>
              :
              <>
                {this.state.sharedBookListsMap.size > 0 ?
                  <>
                    {[...this.state.sharedBookListsMap.keys()].map(bookList => {

                      const books = this.state.sharedBookListsMap.get(bookList);

                      return (
                        <Card key={bookList.id} className='m-4'>

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
                  </>
                  :
                  <h3 className="text-center mt-5">No Shared BookLists Found</h3>}
              </>
            }
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default Home;