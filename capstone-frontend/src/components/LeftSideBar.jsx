import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, Card } from 'react-bootstrap';
import "../styles/LeftSideBar.css";
// import '../App.css';


export class LeftSideBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      bookLists: []
    }
  }

  fetchBookLists = async () => {

    const userID = window.sessionStorage.getItem("userID");

    const bookLists = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/booklist?userID=${userID}`, {
      method: "GET",
    }).then(resp => resp.json());

    this.setState({ bookLists });
  }

  componentDidMount() {
    this.fetchBookLists();
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
                <Card.Body>

                  {
                    this.state.bookLists.map(bookList =>
                      <Link to={`/listpage/${bookList.id}`} key={bookList.id} className="bg-light list-group-item list-group-item-action">
                        <div className="d-flex w-100 justify-content-start align-items-center">
                          <span> {bookList.name}</span>
                        </div>
                      </Link>
                    )
                  }

                  <Link to="/createlist" className="bg-light list-group-item list-group-item-action">
                    <div className="d-flex w-100 justify-content-start align-items-center">
                      <span> Create New List </span>
                    </div>
                  </Link>

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