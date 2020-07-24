import React from 'react';
import { Tab, Nav, Row, Col } from 'react-bootstrap';
import BookSearchList from './BookSearchList';
import { ClubSearchList } from './ClubSearchList';
import '../styles/Browse.css';

const Browse = (props) => {
  console.log(props.clubs);

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
              <BookSearchList searchQuery={props.searchQuery} bookLists={props.bookLists} updateBookLists={props.updateBookLists} />
            </Tab.Pane>
            <Tab.Pane eventKey='2'>
              <ClubSearchList searchQuery={props.searchQuery} clubs={props.clubs} />
            </Tab.Pane>
            <Tab.Pane eventKey='3'>
              <p> Future person search! </p>
            </Tab.Pane>
          </Tab.Content>
        </Row>
      </Tab.Container>
    </>
  );
}

export default Browse;