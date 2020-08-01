import React, { Component } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import moment from 'moment';
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
      "whenCreated": (new Date()).toUTCString()
    };
    fetch("/api/comments", {method: "post", body: JSON.stringify(data)})
        .then(response => response.json())
        .then(commentJson => {
          let comments = this.state.comments;
          comments.push(commentJson);
          this.setState({comments});
        })
        .catch(function(err) {
          //TODO #61: Centralize error output
          alert(err); 
        });
  }

  fetchComments = () => {
    fetch(`/api/comments?assignmentID=${this.props.assignment.id}`)
        .then(response => response.json()).then(commentsJson => this.setState({comments: commentsJson}))
        .catch(function(err) {
          //TODO #61: Centralize error output
          alert(err); 
        });
  }

  onComplete = () => {
    //TODO #90: Create functionality to mark assignments as complete
  }

  componentDidMount() {
    this.fetchComments();
  }

  render() {
    const assignmentPosted = moment(new Date(this.props.assignment.whenCreated)).format('MMMM Do YYYY, h:mm a');
    const assignmentDue = moment(new Date(this.props.assignment.whenDue)).format('MMMM Do YYYY, h:mm a');
    return (
      <div className="assignment-card">
        <div className="assignment-head">
          <div>
            <div className="assignment-date"> Posted: {assignmentPosted} </div> 
            <div className="assignment-date"> Due: {assignmentDue} </div>
            <div className="assignment-text"> {this.props.assignment.text} </div>
          </div>
          <Button onClick={this.onComplete} variant="success"> Mark as Done </Button> 
        </div> 
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
