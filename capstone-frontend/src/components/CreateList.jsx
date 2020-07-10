import React, { Component } from 'react';
import {Button, Form} from 'react-bootstrap'

class CreateList extends Component {

  handleSubmit = (event) => {

    event.preventDefault();

    console.log("Submitted")

    const newBooklist = {
      "userID": window.sessionStorage.getItem("userID"),
      "booklistName": event.target[0].value,
    }

    // Store BookList in Firebase
    fetch("https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/booklist", {
      method: "POST",
      body: JSON.stringify(newBooklist)
    });
  }

  render() {
    return (
      <div>
        <h1 className="text-center mt-4"> Create Booklist </h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId="createBookList">
            <Form.Label>Name of Booklist</Form.Label>
            <Form.Control type="text" placeholder="Enter Name" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Create Booklist
          </Button>
        </Form>
      </div>
    )
  }
}

export default CreateList;