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
      "userID": window.localStorage.getItem("userID"),
      "whenCreated": new Date()
    };
    fetch("https://8080-c462bdd8-69e0-4be9-b400-1ebde23ca93d.ws-us02.gitpod.io/api/comments", {method: "post", body: JSON.stringify(data), credentials:'include'})
        .then(this.fetchComments())
        .catch(function(err) {
          //TODO #61: Centralize error output
          alert(err); 
        });
  }

  fetchComments = () => {
    fetch(`https://8080-c462bdd8-69e0-4be9-b400-1ebde23ca93d.ws-us02.gitpod.io/api/comments?assignmentID=${this.props.assignment.id}`, {credentials:'include'})
        .then(response => response.json()).then(response => this.setState({comments: response}))
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
      <div>
        <div> {this.props.owner.fullname} </div>
        <div> {this.props.assignment.text} </div>
        {this.state.comments.map(c => <CommentCard key={c.id} comment={c} />)}
        <form id="comment-form" onSubmit={this.onComment}>
          <label htmlFor="text"> Comment: </label>
          <textarea rows="5" cols="75" type="text" id="text" name="text" />
          <input id="submit-comment" type="submit" value="Post" />
        </form>
      </div>
    );
  }
} 
 
export default AssignmentCard;
