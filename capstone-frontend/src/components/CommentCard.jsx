import React from 'react';


const CommentCard = ({comment}) => {
  return (
    <div>
      <div> {comment.userID}: </div>
      <div> {comment.text} </div>
      <div> {comment.whenCreated} </div>
    </div>
  );
}

export default CommentCard;
