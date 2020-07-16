import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { Button, Form, Spinner, Modal } from 'react-bootstrap'

class CreateList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      showModal: false
    }
  }

  handleSubmit = async () => {

    this.setState({ loading: true })

    const name = document.getElementById("createBookListForm").value
    const userID = window.localStorage.getItem("userID")

    const newBooklist = {
      "userID": userID,
      "name": name
    }

    // Store BookList in Firebase
    await fetch("/api/booklist", {
      method: "POST",
      body: JSON.stringify(newBooklist)
    });

    const createdBookList = await fetch(`/api/booklist?userID=${userID}&name=${name}`, {
      method: "GET",
    }).then(resp => resp.json());

    this.setState({ loading: false, showModal: false, renderModal: false });

    this.props.history.push(`/listpage/${createdBookList[0].id}`);

    this.props.updateBookLists();
  }

  render() {
    return (
      <div>
        <button className={this.props.btnStyle} onClick={() => this.setState({ showModal: true })}>
          <div className={this.props.textStyle}>
            <span id="create-list-modal"> Create New List </span>
          </div>
        </button>

        <Modal
          size="lg"
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
          aria-labelledby="create-booklists-modal">

          <Modal.Header closeButton>
            <Modal.Title id="create-booklists-modal">
              Create Booklist
                </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="createBookListForm">
                <Form.Label>Name of Booklist</Form.Label>
                <Form.Control type="text" placeholder="Enter Name" />
              </Form.Group>
              <Button variant="primary" type="submit" onClick={() => this.handleSubmit()} disabled={this.state.loading}>
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
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

export default withRouter(CreateList);