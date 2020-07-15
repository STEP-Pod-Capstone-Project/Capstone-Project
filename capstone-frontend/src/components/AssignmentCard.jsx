import React, { Component } from 'react';

import CommentCard from './CommentCard';


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
      "userID": window.localStorage.get("userID"),
      "whenCreated": new Date()
    };
    fetch("https://8080-c462bdd8-69e0-4be9-b400-1ebde23ca93d.ws-us02.gitpod.io/api/comments", {method: "post", body: JSON.stringify(data)})
        .catch(function(err) {
          //TODO #61: Centralize error output
          alert(err); 
        });
  }

  fetchComments = async () => {
    let commentResponse = await fetch("https://8080-c462bdd8-69e0-4be9-b400-1ebde23ca93d.ws-us02.gitpod.io/api/comments", {credentials:'include'})
        .catch(function(err) {
          //TODO #61: Centralize error output
          alert(err); 
        });
    this.setState({comments: commentResponse});
  }

  render() {
    return (
      <div>
        <div> {this.props.owner.fullname} </div>
        <div> {this.props.assignment.text} </div>
        {this.state.comments.map(c => <CommentCard comment={c} />)}
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
