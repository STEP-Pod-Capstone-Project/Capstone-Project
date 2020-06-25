import React, { Component } from 'react';
import '../App.css';

class CreateClub extends Component {
  render() {
    return (
      <form action="/api/clubs" method="post">
        <div> 
          <label for="name"> Club Name </label> 
        </div>
        <div>
          <input type="text" id="name" name="name" />
        </div>
        <div>
          <label for="description"> Club Description </label>
        </div>
        <div>
          <textarea rows="5" cols="75" type="text" id="description" name="description" />
        </div>
        <div>
          <label for="ownerID"> ownerID </label>
        </div>
        <div>
          <input type="text" id="ownerID" name="ownerID" />
        </div>
        <div>
          <label for="gbookID"> gbookID </label>
        </div>
        <div>
          <input type="text" id="gbookID" name="gbookID" />
        </div>
        <div>
          <input type="submit" value="Submit" id="submit" />
        </div>
      </form>
    );
  }
}

export default CreateClub;