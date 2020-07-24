import React from 'react';
import { Tab, Nav, Row, Col } from 'react-bootstrap';
import BookSearchList from './BookSearchList';
import { ClubSearchList } from './ClubSearchList';

import '../styles/Browse.css';

const getBookSearchList = async ({ searchQuery }) => {
    return await fetch(`https://8080-c0019ecb-52af-4655-945f-b5a74df1e54b.ws-us02.gitpod.io/api/search?searchTerm=${searchQuery}`)
      .then(response => response.json())
      .catch(err => alert(err));
}


const Browse = async (props) => {
  console.log(props);

  const searchedBooks = await getBookSearchList(props);

  return (
    <>
      <Tab.Container id='browse-container' className='browse-container' defaultActiveKey='1'>
        <Row>
          <Nav variant='pills' className='flex-row'>
            <Nav.Item>
              <Nav.Link eventKey='1'>Books</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey='2'>Clubs</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey='3'>People</Nav.Link>
            </Nav.Item>
          </Nav>
        </Row>
        <Row>
          <Tab.Content className='w-100'>
            <Tab.Pane eventKey='1'>
              <BookSearchList books={searchedBooks} bookLists={props.bookLists} updateBookLists={props.updateBookLists} />
            </Tab.Pane>
            <Tab.Pane eventKey='2'>
              <ClubSearchList searchQuery={props.searchQuery} />
            </Tab.Pane>
            <Tab.Pane eventKey='3'>
              {//<UserSearchList searchQuery={props.searchQuery} />
              }
              <p>Future users!</p>
            </Tab.Pane>
          </Tab.Content>
        </Row>
      </Tab.Container>
    </>
  );
}

export default Browse;