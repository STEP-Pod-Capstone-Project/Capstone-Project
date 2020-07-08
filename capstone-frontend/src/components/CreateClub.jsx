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
      if (formElements[i].name.length != 0 && 
          formElements[i].type !== "submit" && formElements[i].value.length != 0) {
        data[formElements[i].name] = formElements[i].value;
      }
    }
    fetch("/api/clubs", 
        {method: "post", body: JSON.stringify(data)})
        .then(function() {
          history.push(`/clubpage/${data.id}`);
        })
        .catch(function(e) {
          console.log(e);
          alert("Looks like we're having trouble connecting to our database, hang tight!");
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
            <label htmlFor="id"> Club ID </label> 
          </div>
          <div>
            <input type="text" id="id" name="id" />
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
            <input id="create-club" type="submit" value="Create your Club!" />
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(CreateClub);