import React, { Component } from 'react';
import moment from 'moment';

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
        .catch(e => console.log(e));
  }

  componentDidMount() {
    this.fetchUserData();
  }

  render() {
    const user = this.state.user && 
                     <span className="name"> 
                        {this.state.user.fullName} 
                      </span>;
    const commentCreated = moment(new Date(this.props.comment.whenCreated)).format('MMMM Do YYYY, h:mm a');
    return (
      <div className="comment-card">
        <img className="profile" alt="Profile" src={this.state.user.profileImageUrl} />
        <div>
          <div className="header">
            {user}
            <span className="date">
              {commentCreated}
            </span>
          </div>
          <div> {this.props.comment.text} </div>
        </div>
      </div>
    );
  }
}

export default CommentCard;
