import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../styles/Groups.css';

class AdminClubPage extends Component {
  handleUpdate = (e) => {
    const history = this.props.history;
    e.preventDefault();
    let data = {};
    const formElements = document.getElementById("update-club-form").elements;
    for (let i = 0; i < formElements.length; i++) {
      if (formElements[i].name.length !== 0 && 
          formElements[i].type !== "submit" && formElements[i].value.length !== 0) {
        data[formElements[i].name] = formElements[i].value;
      }
    }
    data.id = this.props.club.id;
    if (window.localStorage.getItem("userID") !== this.props.club.ownerID) {
      alert("Update failed. You do not own this club.");
      return;
    } 

    console.log(data);

    fetch("/api/clubs", {method: "put", body: JSON.stringify(data)})
        .then(function() {
          history.push(`/clubpage/${data.id}`);
        })
        .catch(function(e) {
          console.log(e);
          alert("Looks like we're having trouble connecting to our database, hang tight!");
        });  
  }

  handleAssignmentPost = (e) => {
    const history = this.props.history;
    e.preventDefault();
    if (window.localStorage.getItem("userID") !== this.props.club.ownerID) {
      alert("Assignment creation failed. You do not own this club.");
      return;
    }
    let data = {
      "clubID": this.props.club.id,
      "text": e.target[0].value,
      "whenCreated": new Date()
    };
    console.log(data);
    fetch(`/api/assignments`, {method: "post", body: JSON.stringify(data)})
        .then(history.push(`/clubpage/${data.clubID}`))
        .catch(function(err) {
          //TODO #61: Centralize error output
          alert(err); 
        });
  }

  handleDelete = () => {
    if (window.localStorage.getItem("userID") !== this.props.club.ownerID) {
      alert("Delete failed. You do not own this club.");
      return;
    } 
    const history = this.props.history;
    fetch(`/api/clubs?id=${this.props.match.params.id}`, {method: "delete"})
        .then(function() {
            history.push("/myclubs");
        })
        .catch(function(err) {
            //TODO #61: Centralize error output
            alert(err);
        });
  }

  render() {
    return (
      <div className="page-container">
        <div>Post Assignment</div>
        <form onSubmit={this.handleAssignmentPost} id="assignment-post-form">
          <div>
            <label htmlFor="text"> Assignment Text </label> 
          </div>
          <div>
            <textarea rows="5" cols="75" type="text" id="text" name="text" />
          </div>
        </form> 
        <div>Update Club</div> 
        <form onSubmit={this.handleUpdate} id="update-club-form">
          <div> 
            <label htmlFor="name"> Club Name </label> 
          </div>
          <div>
            <input type="text" id="name" name="name" />
          </div>
          <div>
            <label htmlFor="description"> Club Description </label>
          </div>
          <div>
            <textarea rows="5" cols="75" type="text" id="description" name="description" />
          </div>
          <div>
            <label htmlFor="gbookID"> gbookID </label>
          </div>
          <div>
            <input type="text" id="gbookID" name="gbookID" />
          </div>
          <div>
            <label htmlFor="add_memberIDs"> add_memberID </label>
          </div>
          <div>
            <input type="text" id="add_memberIDs" name="add_memberIDs" />
          </div>
          <div>
            <label htmlFor="remove_memberIDs"> remove_memberID </label>
          </div>
          <div>
            <input type="text" id="remove_memberIDs" name="remove_memberIDs" />
          </div>
          <div>
            <input id="update-club" type="submit" value="Update your Club" />
          </div>
        </form>
        <button onClick={this.handleDelete}> Delete </button>
      </div>
    );
  }
}

export default AdminClubPage;