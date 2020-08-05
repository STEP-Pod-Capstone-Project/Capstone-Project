import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Form, Modal } from 'react-bootstrap';

import '../styles/Modal.css';

class UpdateList extends Component {

  constructor(props) {
    super(props)

    this.state = {
      showModal: false,
      newName: '',
    }
  }

  handleNameChange = (event) => {
    const newName = event.target.value;
    if (newName !== this.state.newName) {
      this.setState({ newName });
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const updatedBookListJson = {
      id: this.props.bookListId,
      name: this.state.newName,
    }

    // Update title in the ListPage
    this.props.updateBookListTitle(this.state.newName);

    await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/booklist`, {
      method: 'PUT',
      body: JSON.stringify(updatedBookListJson)
    })

    // Refresh the Booklists in the left side bar
    this.props.updateBookLists();
    // TODO #132:Add Error Messaging For Failure to Update Booklist
    this.setState({ showModal: false, newName: '' });
  }

  handleDelete = () => {
    const currentUrl = window.location.pathname;
    this.props.deleteBookList(this.props.bookListId, this.props, currentUrl);
  }

  render() {
    return (
      <>
        <button className={this.props.btnStyle} onClick={() => { this.setState({ showModal: true }) }}>
          <div className={this.props.textStyle}>
            <span id='manage-list-modal'> Manage Booklist </span>
          </div>
        </button>

        <Modal
          dialogClassName='modal-style'
          size='lg'
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
          aria-labelledby='manage-booklist-modal'>

          <Modal.Header closeButton>
            <Modal.Title id='manage-booklist-modal'>
              Manage Booklist
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId='form-booklist-newname'>
                <Form.Label>New Booklist Name</Form.Label>
                <Form.Control type='text' placeholder='Enter Name' onChange={(event) => this.handleNameChange(event)} />
              </Form.Group>
              <div className='text-center'>
                <Button
                  className='text-center'
                  variant='primary'
                  type='submit'
                  disabled={this.state.newName.length === 0}>
                  Update Booklist
                </Button>
                <Button
                  className='text-center ml-3'
                  variant='danger'
                  onClick={() => this.handleDelete()}>
                  Delete Booklist
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    )
  }
}

export default withRouter(UpdateList);