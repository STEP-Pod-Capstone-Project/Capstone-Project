import React, { Component } from 'react';
import { Button, Card, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import '../styles/Groups.css';

class ClubGridItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requested: this.props.club.requestIDs.includes(window.localStorage.getItem("userID")), 
      bookTitle: '',
    }
  }

  requestJoin = () => {
    const putBody = {
      id: this.props.club.id,
      add_requestIDs: window.localStorage.getItem("userID")
    };
    fetch(`/api/clubs`, { method: "put", body: JSON.stringify(putBody) })
      .then(this.setState({ requested: true }))
      .catch(e => console.log(e));
  }

  unRequestJoin = () => {
    const putBody = {
      "id": this.props.club.id,
      "remove_requestIDs": window.localStorage.getItem("userID")
    };
    fetch(`/api/clubs`, { method: "put", body: JSON.stringify(putBody)})
        .then(this.setState({ requested: false }))
        .catch(e => console.log(e));
  }

  fetchBook = () => {
    if (this.props.club.gbookID.length === 0) {
      this.setState({ title: 'Nothing yet!' });
    } else {
      fetch(`/api/search?gbookId=${this.props.club.gbookID}`)
        .then(response => response.json())
        .then(books => books[0])
        .then(book => book.authors && book.authors.length > 0 
          ? book.title
          : 'Nothing yet!'
        )
        .then(title => this.setState({ title }))
        .catch(e => {
          console.error(e);
          return 'Nothing yet!';
        });
    }
  }

  componentDidMount() {
    this.fetchBook();
  }

  render() {
    console.log(this.props.club);
    const userID = window.localStorage.getItem("userID");
    const isOwner = this.props.club.ownerID === userID
    const isMember = this.props.club.memberIDs.includes(userID);
    const isViewer = !isOwner && !isMember;
    const isRequester = this.props.club.requestIDs.includes(userID);
    const title = this.state.title && this.state.title.length > 0 ?
      this.state.title : 'Nothing yet!';
    return (
      <Col xs={12} sm={6} md={3}>
        <Card className="group-container">
          <Link id="group-link" to={`/clubpage/${this.props.club.id}`}>
            {isOwner && <Card.Header className="header text-muted"> Owner </Card.Header>}
            {isMember && <Card.Header className="header text-muted"> Member </Card.Header>}
            {isViewer && <Card.Header className="header text-muted"> Viewer </Card.Header>}
            <Card.Body>
              <Card.Title id="group-name"> {this.props.club.name} </Card.Title>
              <Card.Subtitle className="mb-2 text-muted" id="group-gbook"> Reading: {title} </Card.Subtitle>
              <Card.Text id="group-description"> {this.props.club.description} </Card.Text>
              {isViewer && !isRequester && <Button variant="primary" onClick={this.requestJoin}> Request to Join! </Button>}
              {isRequester && <Button variant="danger" onClick={this.unRequestJoin}> Withdraw Request </Button>}
            </Card.Body>
            <Card.Footer className="footer text-muted"> {this.props.club.memberIDs.length} Members </Card.Footer>
          </Link>
        </Card>
      </Col>
    );
  }

};

export default ClubGridItem;