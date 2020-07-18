import React, { Component } from 'react';

import '../styles/Groups.css';


class CommentCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    }
  }

  fetchUserData = async () => {
    await fetch(`https://8080-bfda3bef-a7ee-4ff4-91c6-c56fa0a00eba.ws-us02.gitpod.io/api/user?id=${this.props.comment.userID}`)
        .then(response => response.json()).then(userJson => this.setState({user: userJson}))
        .catch(function(err) {
            //TODO #61: Centralize error output
            alert(err); 
        });
  }

  componentDidMount() {
    this.fetchUserData();
  }

  render() {
    const user = this.state.user && <div> {this.state.user.fullName}: </div>;
    return (
      <div className="comment-border">
        {user}
        <div> {this.props.comment.text} </div>
        <div> {(new Date(this.props.comment.whenCreated)).toString()} </div>
      </div>
    );
  }
}

export default CommentCard;
