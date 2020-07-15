import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, Card, Button } from 'react-bootstrap';
import CreateList from './CreateList'
import "../styles/LeftSideBar.css";


export class LeftSideBar extends Component {

  deleteBookList = async (bookListId) => {

    // Delete BookList in Firebase
    await fetch(`/api/booklist?id=${bookListId}`, {
      method: "DELETE",
    });

    this.fetchBookLists();

    // These lines of code check if the current BookList URL has the same id as the one being deleted
    // If so we redirect home
    const currentUrlPath = new URL(window.location.href).pathname;

    if (currentUrlPath.includes(bookListId)) {
      document.location.href = "/";
      //TODO: Use React Router
    }
  }

  render() {
    return (
      <div id="left-sidebar-container" className="sidebar-expanded d-none d-md-block col-2 sidebar-container">
        <ul className="list-group sticky-top sticky-offset">

          <Accordion defaultActiveKey="0" style={{ marginRight: -14.3 }}>
            <Card>
              <Link to="/" className="bg-dark list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-start align-items-center">
                  <span className="fa fa-tasks fa-fw mr-3"></span>
                  <span id="home-link" className="menu-collapsed"> Home </span>
                </div>
              </Link>
            </Card>

            <Card>
              <Link to="/browse" className="bg-dark list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-start align-items-center">
                  <span className="fa fa-tasks fa-fw mr-3"></span>
                  <span id="browse-link" className="menu-collapsed"> Browse </span>
                </div>
              </Link>
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
                <div className="bg-dark list-group-item list-group-item-action">
                  <div className="d-flex w-100 justify-content-start align-items-center">
                    <span className="fa fa-list fa-fw mr-3"></span>
                    <span> My Library </span>
                  </div>
                </div>
              </Accordion.Toggle>

              <Accordion.Collapse eventKey="3">
                <Card.Body id="mylists-link">
                  {
                    this.props.bookLists.map(bookList =>
                      <div key={bookList.id} className="bg-light p-0 list-group-item list-group-item-action">
                        <div className="d-flex w-100 justify-content-start align-items-center">
                          <Link to={`/listpage/${bookList.id}`} className="bg-light border-0 list-group-item list-group-item-action">
                            <span> {bookList.name}</span>
                          </Link>
                          <Button className="border-0 bg-transparent" onClick={() => this.deleteBookList(bookList.id)}>
                            <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-trash-fill" fill="black" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5a.5.5 0 0 0-1 0v7a.5.5 0 0 0 1 0v-7z" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    )
                  }

                  <CreateList updateBookLists={this.props.updateBookLists} btnStyle="bg-light list-group-item list-group-item-action" textStyle={"d-flex w-100 justify-content-start align-items-center"}/>

                </Card.Body>
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
  }
}

export default LeftSideBar