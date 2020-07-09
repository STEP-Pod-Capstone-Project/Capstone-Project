import React from 'react';
import { Link } from 'react-router-dom';
import { Accordion, Card } from 'react-bootstrap'
import "../styles/LeftSideBar.css"
// import '../App.css';

const LeftSideBar = () => {
  return (
    <div id="left-sidebar-container" className="sidebar-expanded d-none d-md-block col-2 sidebar-container">
      <ul className="list-group sticky-top sticky-offset">

        <Accordion defaultActiveKey="0">
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0">
              <Link to="/" className="bg-dark list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-start align-items-center">
                  <span className="fa fa-tasks fa-fw mr-3"></span>
                  <span id="home-link" className="menu-collapsed"> Home </span>
                </div>
              </Link>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>My Home Dropdown</Card.Body>
            </Accordion.Collapse>
          </Card>

          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="1">
              <Link to="/browse" className="bg-dark list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-start align-items-center">
                  <span className="fa fa-tasks fa-fw mr-3"></span>
                  <span id="browse-link" className="menu-collapsed"> Browse </span>
                </div>
              </Link>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body>Browse Dropdown</Card.Body>
            </Accordion.Collapse>
          </Card>

          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="2">
              <Link to="/myreads" className="bg-dark list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-start align-items-center">
                  <span className="fa fa-tasks fa-fw mr-3"></span>
                  <span id="mybooks-link" className="menu-collapsed"> My Books </span>
                </div>
              </Link>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="2">
              <Card.Body>My Books Dropdown</Card.Body>
            </Accordion.Collapse>
          </Card>

          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="3">
              <Link to="/mylists" className="bg-dark list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-start align-items-center">
                  <span className="fa fa-tasks fa-fw mr-3"></span>
                  <span id="mylists-link" className="menu-collapsed"> My Lists </span>
                </div>
              </Link>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="3">
              <Card.Body>My Lists Dropdown</Card.Body>
            </Accordion.Collapse>
          </Card>

          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="4">
              <Link to="/myclubs" className="bg-dark list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-start align-items-center">
                  <span className="fa fa-tasks fa-fw mr-3"></span>
                  <span id="myclubs-link" className="menu-collapsed"> My Clubs </span>
                </div>
              </Link>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="4">
              <Card.Body>My Clubs Dropdown</Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>





      </ul>
    </div >
  );
};

export default LeftSideBar;