import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import '../styles/Groups.css';

class CreateClub extends Component {
  handleSubmit = (e) => {
    const history = this.props.history;
    e.preventDefault();
    let data = {};
    const formElements = document.getElementById("create-club-form").elements;
    for (let i = 0; i < formElements.length; i++) {
      if (formElements[i].type !== "submit") {
        data[formElements[i].name] = formElements[i].value;
      }
    }
    let response = fetch("/api/clubs", 
        {method: "post", body: JSON.stringify(data)});
    response.catch(function(err) {
      alert(err);
    });
    response.then(response => response.json()).then(response => {
      history.push(`/clubpage/${response.id}`);
    });
  }

  render() {
    return (
      <div className="page-container">
        <div className="title"> Create a Club </div>
        <form onSubmit={this.handleSubmit} id="create-club-form">
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
            <label htmlFor="ownerID"> ownerID </label>
          </div>
          <div>
            <input type="text" id="ownerID" name="ownerID" />
          </div>
          <div>
            <label htmlFor="gbookID"> gbookID </label>
          </div>
          <div>
            <input type="text" id="gbookID" name="gbookID" />
          </div>
          <div>
            <label htmlFor="memberIDs"> memberIDs </label>
          </div>
          <div>
            <input type="text" id="memberIDs" name="memberIDs" />
          </div>
          <div>
            <input id="create-club" type="submit" value="Create your Club!" />
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(CreateClub);