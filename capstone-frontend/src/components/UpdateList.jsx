import React, { Component } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

import '../styles/Modal.css'

export class UpdateList extends Component {

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

  handleSubmit = () => {
    const updatedBookListJson = {
      id: this.props.bookListId,
      name: this.state.newName,
    }

    fetch(`/api/clubs`, {
      method: 'PUT',
      body: JSON.stringify(updatedBookListJson)
    })

    this.props.updateListPage();
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
            <Form>
              <Form.Group controlId='form-booklist-newname'>
                <Form.Label>New Booklist Name</Form.Label>
                <Form.Control type='text' placeholder='Enter Name' onChange={(event) => this.handleNameChange(event)} />
              </Form.Group>
              <div className='text-center'>
                <Button
                  className='text-center'
                  variant='primary' type='submit'
                  onClick={() => this.handleSubmit()}
                  disabled={this.state.newName.length === 0}>
                  Update Booklist
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    )
  }
}