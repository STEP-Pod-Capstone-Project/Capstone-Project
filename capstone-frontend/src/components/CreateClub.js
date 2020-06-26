import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import '../styles/Clubs.css';

import $ from 'jquery'; 

class CreateClub extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    console.log("work");
    e.preventDefault();
    const form = $("#createclub-form");
    const data = form.serialize();

    $.ajax({
        url: '/api/clubs',
        type: 'post',
        data: data,
        success: function(data) {
          console.log("success");
          return <Redirect to={`/clubpage/${data.id}`} />
        },
        error: function() {
          alert("Looks like our database is having some trouble, hang tight!");
        }
    });    
  }

  render() {
    return (
      <div className="page-container">
        <div className="title"> Create a Club </div>
        <form onSubmit={this.handleSubmit} id="createclub-form">
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
              <input id="createclub" type="submit" value="Create your Club!" />
          </div>
        </form>
      </div>
    );
  }
}

export default CreateClub;