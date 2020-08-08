import React, { Component } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import moment from 'moment';
import CommentCard from './CommentCard';

import '../styles/Groups.css';


class AssignmentCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      completed: this.props.assignment.completedIDs &&
        this.props.assignment.completedIDs.includes(window.localStorage.getItem('userID')),
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
    e.target[0].value = '';
    fetch("https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/comments", { method: "post", body: JSON.stringify(data) })
      .then(response => response.json())
      .then(commentJson => {
        let comments = this.state.comments;
        comments.push(commentJson);
        this.setState({ comments });
      })
      .catch(e => console.log(e));
  }

  fetchComments = () => {
    fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/comments?assignmentID=${this.props.assignment.id}`)
      .then(response => response.json()).then(commentsJson => this.setState({ comments: commentsJson }))
      .catch(e => console.log(e));
  }

  onComplete = () => {
    const completeAssignment = {
      id: this.props.assignment.id,
      add_completedIDs: window.localStorage.getItem('userID')
    }
    fetch('/api/assignments', { method: 'put', body: JSON.stringify(completeAssignment) })
      .then(this.setState({ completed: true }))
      .catch(e => console.log(e));
  }

  onUncomplete = () => {
    const uncompleteAssignment = {
      id: this.props.assignment.id,
      remove_completedIDs: window.localStorage.getItem('userID')
    }
    fetch('/api/assignments', { method: 'put', body: JSON.stringify(uncompleteAssignment) })
      .then(this.setState({ completed: false }))
      .catch(e => console.log(e));
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
          {this.state.completed
            ? <Button onClick={this.onUncomplete} variant="danger"> Unmark as Done </Button>
            : <Button onClick={this.onComplete} variant="success"> Mark as Done </Button>}
        </div>
        {this.state.comments.map(c => <CommentCard key={c.id} comment={c} />)}
        <Form id="comment-form" onSubmit={this.onComment}>
          <Form.Group as={Row} controlId="formComment">
            <Col xs={{ "offset": 1, "span": 7 }}>
              <Form.Control type="text" placeholder="Enter a comment..." />
            </Col>
            <Col>
              <Button variant="primary" type="Submit"> Post </Button>
            </Col>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default AssignmentCard;
