import React, { Component } from 'react';

import BookSearchTile from './BookSearchTile';
import AssignmentCard from './AssignmentCard';
 
import '../styles/Groups.css';
 
class ClubPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      club: {},
      book: {},
      assignments: [],
      owner: {}, 
      members: []
    }
  }

  fetchData = async () => {
    console.log(this.props);
    await fetch(`https://8080-c462bdd8-69e0-4be9-b400-1ebde23ca93d.ws-us02.gitpod.io/api/clubs?id=${this.props.id}`, 
    {credentials:'include'})
        .then(response => response.json()).then(response => this.setState({club: response[0]}))
        .catch(function(err) {
            //TODO #61: Centralize error output
            alert(err);
        });

    await fetch(`https://8080-c462bdd8-69e0-4be9-b400-1ebde23ca93d.ws-us02.gitpod.io/api/search?gbookId=${this.state.club.gbookID}`, 
    {credentials:'include'})
        .then(response => response.json()).then(response => this.setState({book: response[0]}))
        .catch(function(err) {
            //TODO #61: Centralize error output
            alert(err);
        });

    await fetch(`https://8080-c462bdd8-69e0-4be9-b400-1ebde23ca93d.ws-us02.gitpod.io/api/assignments?clubID=${this.state.club.id}`, 
    {credentials:'include'})
        .then(response => response.json()).then(response => this.setState({assignments: response}))
        .catch(function(err) {
            //TODO #61: Centralize error output
            alert(err); 
        });


    // let ownerResponse = await fetch(`https://8080-c462bdd8-69e0-4be9-b400-1ebde23ca93d.ws-us02.gitpod.io/api/user?id=${this.state.club.ownerID}`, 
    // {credentials:'include'})
    //     .then(response => response.json())
    //     .catch(function(err) {
    //         //TODO #61: Centralize error output
    //         alert(err); 
    //     });
    // this.setState({owner: ownerResponse[0]});

    // let memberID;
    // for (memberID of this.state.club.memberIDs) {
    //   fetch(`https://8080-c462bdd8-69e0-4be9-b400-1ebde23ca93d.ws-us02.gitpod.io/api/user?id=${memberID}`, 
    //   {credentials:'include'})
    //       .then(response => response.json())
    //       .then(function(res) {
    //           let memberArray = this.state.members.concat(res[0]);
    //           this.setState({members: memberArray})
    //       }).then(console.log(this.state.members))
    //       .catch(function(err) {
    //         //TODO #61: Centralize error output
    //         alert(err); 
    //       });
    // } 
  }
 
  handleClick = () => {
    const history = this.props.history;
    fetch(`https://8080-c462bdd8-69e0-4be9-b400-1ebde23ca93d.ws-us02.gitpod.io/api/clubs?id=${this.props.match.params.id}`, {method: "delete"})
        .then(function() {
            history.push("/myclubs");
        })
        .catch(function(err) {
            //TODO #61: Centralize error output
            alert(err);
        });
  }
 
  componentDidMount() {
    this.fetchData();
  }
 
  render() {
    //const bookTile = this.state.book.authors && <BookSearchTile book={this.state.book} userBookLists={this.props.userBookLists} updateBookLists={this.props.fetchBookLists}/>;
    return (
      <div className="text-center"> 
        <div className="title"> Club Name: {this.state.club.name} </div>
        <div> Club Owner: {this.state.owner.fullname}, {this.state.owner.email} </div>
        <div> Club Members: {this.state.members.map(m => m.profileObj.fullname)} </div>
        <div className="description"> Description: {this.state.club.description} </div>
        <div className="description"> Current Book: </div>
        <div> {this.state.assignments.map(a => <AssignmentCard key={a.id} assignment={a} owner={this.state.owner} />)} </div>
        <button onClick={this.handleClick}> Delete </button>
      </div>
    );
  }
}
 
export default ClubPage;
