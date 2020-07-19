import React, { Component } from 'react';

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
        .then(this.fetchComments())
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

  componentDidMount() {
    this.fetchComments();
  }

  render() {
    return (
      <div className="assignment-border">
        <div> {this.props.assignment.text} </div>
        <div> Created: {(new Date(this.props.assignment.whenCreated)).toString()} </div> 
        <div> Due: {(new Date(this.props.assignment.whenDue)).toString()} </div> 
        {this.state.comments.map(c => <CommentCard key={c.id} comment={c} />)}
        <form id="comment-form" onSubmit={this.onComment}>
          <div>
            <label htmlFor="text"> Comment: </label>
          </div>
          <div>
            <textarea rows="1" cols="75" type="text" id="text" name="text" />
          </div>
          <div>
            <input id="submit-comment" type="submit" value="Post" />
          </div>
        </form>
      </div>
    );
  }
} 
 
export default AssignmentCard;
