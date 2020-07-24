// import React from 'react';
// import { CardDeck } from 'react-bootstrap';
// import FuzzySearch from 'fuzzy-search';
// import { UserCard } from './UserCard';

// import '../styles/Groups.css';

// const UserSearchList = ({ searchQuery, users }) => {
//   let result = [];
//   if (users) {
//     const searcher = new FuzzySearch(users, ['fullName', 'email'], {
//       sort: true,
//     });
//     result = searcher.search(searchQuery);
//   }

//   let userArray = [];
//   result.forEach(user => {
//     console.log("user in array", user);
//     //clubArray.push(<ClubGridItem key={club.id} club={club} />);
//     userArray.push(user.email);
//   });

//   return (
//     <>
//       {userArray.length === 0
//         ? <p>There are no users for this search query.</p>
//         : <CardDeck className="groups-list-container"> {userArray} </CardDeck>
//       }
//     </>
//   );

// }


// export { UserSearchList };