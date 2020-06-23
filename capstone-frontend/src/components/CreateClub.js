import React, { Component } from 'react';
import '../App.css';

class CreateClub extends Component {
  render() {
    return (
      <form action="https://8080-0b34ed39-12e2-4bb0-83f0-3edbd4365bbd.us-east1.cloudshell.dev/clubs" method="post">
        <label for="name"> Club Name </label> <br />
        <input type="text" id="name" name="name" /> <br />
        <label for="description"> Club Description </label> <br />
        <textarea rows="5" cols="75" type="text" id="description" name="description" /> <br />
        <label for="ownerID"> ownerID </label> <br />
        <input type="text" id="ownerID" name="ownerID" /> <br />
        <label for="gbookID"> gbookID </label> <br />
        <input type="text" id="gbookID" name="gbookID" /> <br />
        <input type="submit" value="Submit" id="submit" /> <br />
      </form>
    );
  }
}

export default CreateClub;