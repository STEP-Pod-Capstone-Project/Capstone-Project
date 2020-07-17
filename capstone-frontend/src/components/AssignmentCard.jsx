import React, { Component } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

import CommentCard from './CommentCard';

import '../styles/Groups.css';


class AssignmentCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: []
    }
  }
  onComment = (e) => {
    e.preventDefault();
    let data = {
      "assignmentID": this.props.assignment.id,
      "text": e.target[0].value,
      "userID": window.localStorage.getItem("userID"),
      // "whenCreated": (new Date()).toUTCString()
    };
    fetch("https://8080-bfda3bef-a7ee-4ff4-91c6-c56fa0a00eba.ws-us02.gitpod.io/api/comments", {method: "post", body: JSON.stringify(data)})
        .then(this.fetchComments())
        .catch(function(err) {
          //TODO #61: Centralize error output
          alert(err); 
        });
  }

  fetchComments = () => {
    fetch(`https://8080-bfda3bef-a7ee-4ff4-91c6-c56fa0a00eba.ws-us02.gitpod.io/api/comments?assignmentID=${this.props.assignment.id}`)
        .then(response => response.json()).then(commentsJson => this.setState({comments: commentsJson}))
        .catch(function(err) {
          //TODO #61: Centralize error output
          alert(err); 
        });
  }

  componentDidMount() {
    this.fetchComments();
  }

  render() {
    return (
      <div className="assignment-border">
        <div> {this.props.assignment.text} </div>
        {/* <div> Created: {new Date(this.props.assignment.whenCreated)} </div> 
        <div> Due: {new Date(this.props.assignment.whenDue)} </div>  */}
        {this.state.comments.map(c => <CommentCard key={c.id} comment={c} />)}
        <Form id="comment-form" onSubmit={this.onComment}>
          <Form.Group as={Row} controlId="formComment">
            <Col xs={{"offset": 1, "span": 9}}>
              <Form.Control type="text" placeholder="Enter a comment..." />
            </Col>
            <Col xs={1}>
              <Button variant="primary" type="Submit"> Post </Button> 
            </Col>
          </Form.Group>
        </Form>
      </div>
    );
  }
} 
 
export default AssignmentCard;
