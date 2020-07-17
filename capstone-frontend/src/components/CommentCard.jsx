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
    await fetch(`/api/user?id=${this.props.comment.userID}`)
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
        {/* <div> {new Date(this.props.comment.whenCreated)} </div> */}
      </div>
    );
  }
}

export default CommentCard;
