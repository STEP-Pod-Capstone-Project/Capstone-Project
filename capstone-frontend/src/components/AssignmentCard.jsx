import React, { Component } from 'react';

import CommentCard from './CommentCard';


class AssignmentCard extends Component {
  onComment = (e) => {
    e.preventDefault();
    let data = {
      "assignmentID": this.props.assignment.id,
      "text": e.target[0].value,
      "userID": window.localStorage.get("userID"),
      "whenCreated": new Date()
    };
    fetch("/api/comments", {method: "post", body: JSON.stringify(data)})
        .catch(function(err) {
          //TODO #61: Centralize error output
          alert(err); 
        });
  }

  render() {
    return (
      <div>
        <div> {this.props.owner.fullname} </div>
        <div> {this.props.assignment.text} </div>
        {this.props.assignment.comments.map(c => <CommentCard comment={c} />)}
        <form id="comment-form" onSubmit={this.onComment}>
          <label for="text"> Comment: </label>
          <textarea rows="5" cols="75" type="text" id="text" name="text"> </textarea>
          <input id="submit-comment" type="submit" value="Post" />
        </form>
      </div>
    );
  }
} 
 
export default AssignmentCard;
