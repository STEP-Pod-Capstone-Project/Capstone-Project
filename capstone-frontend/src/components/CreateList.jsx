import React, { Component } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap'

class CreateList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      loading: false
    }
  }

  handleSubmit = async (event) => {

    this.setState({ loading: true })

    event.preventDefault();

    const name = event.target[0].value

    const newBooklist = {
      "userID": window.localStorage.getItem("userID"),
      "name": name,
    }

    // Store BookList in Firebase
    await fetch("/api/booklist", {
      method: "POST",
      body: JSON.stringify(newBooklist)
    });

    const createdBookList = await fetch(`/api/booklist?userID=${window.localStorage.getItem("userID")}&name=${name}`, {
      method: "GET",
    }).then(resp => resp.json());

    document.location.href = `/listpage/${createdBookList[0].id}`;

    this.setState({ loading: false })
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
          <Button variant="primary" type="submit" disabled={this.state.loading}>
            Create Booklist
            {this.state.loading &&
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="ml-4"
              />}
          </Button>
        </Form>
      </div>
    )
  }
}

export default CreateList;