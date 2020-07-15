import React from 'react';


const CommentCard = ({text, userID, whenCreated}) => {
  return (
    <div>
      <div> {userID}: </div>
      <div> {text} </div>
      <div> {whenCreated} </div>
    </div>
  );
}

export default CommentCard;
