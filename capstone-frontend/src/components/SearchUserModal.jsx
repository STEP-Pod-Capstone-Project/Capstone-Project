import React, { Component } from 'react';

import { Button, Form, Spinner, Modal, Col, Row, Card } from 'react-bootstrap'

import '../styles/SearchUserModal.css'
import '../styles/Modal.css'

export class SearchUserModal extends Component {

  constructor(props) {
    super(props)

    this.state = {
      fetchingUsers: false, // For Spinner
      showModal: false,
      typingTimeout: 0,
      searchTerm: '',
      searchResults: [],
      addedUsers: [],
      resultsFound: false,
    }
  }

  getBooks = async (searchTerm) => {

    this.setState({ fetchingUsers: true })

    let searchResults;

    if (searchTerm === '') {
      searchResults = [];

      this.setState({ searchResults, fetchingUsers: false, resultsFound: false })
    }
    else {
      searchResults = await fetch(`https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/userSearch?searchTerm=${searchTerm}`)
        .then(response => response.json())
        .catch(err => alert(err));

      if (typeof searchResults === 'undefined') {
        searchResults = [];
      }

      if (searchResults.length !== 0) {
        this.setState({ searchResults, fetchingUsers: false, resultsFound: true }) // Guilty
      }
      else {
        this.setState({ searchResults, fetchingUsers: false, resultsFound: false }) // Not Guilty
      }
    }
  }

  handleSearchTermChange = (event) => {

    // resultsFound innocent until proven Guilty
    this.setState({ searchResults: [], resultsFound: true })

    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    this.setState({
      searchTerm: event.target.value,
      typingTimeout: setTimeout(async () => {
        await this.getBooks(this.state.searchTerm)
      }, 500)
    })
  }

  addUserToCheckout = (user) => {
    // Rerender
    this.setState({ addedUsers: [...this.state.addedUsers, user] })
  }

  removeUserFromCheckout = (user) => {

    const index = this.state.addedUsers.indexOf(user);
    this.state.addedUsers.splice(index, 1)

    // Rerender
    this.setState({ addedUsers: this.state.addedUsers })
  }

  handleSubmit = async () => {

    if (this.state.addedUsers.length !== 0) {

      await Promise.all(this.state.addedUsers.map(async user => {


      }));

      this.setState({ showModal: false, searchTerm: '', searchResults: [], addedUsers: [], resultsFound: false })
      await this.props.update();
    }

    else {
      this.setState({ showModal: false, searchTerm: '', searchResults: [], addedUsers: [], resultsFound: false })
    }
  }

  render() {
    return (
      <div>
        <button className={this.props.btnStyle} onClick={() => this.setState({ showModal: true })}>
          <div className={this.props.textStyle}>
            <span id='create-list-modal'> {this.props.text || 'Search for Users'} </span>
          </div>
        </button>

        <Modal
          dialogClassName="modal-style"
          size="lg"
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false, searchTerm: '', searchResults: [], addedUsers: [] })}
          aria-labelledby='search-users-modal'>

          <Modal.Header closeButton>
            <Modal.Title id='search-users-modal'>
              {this.props.text || 'Search for Users'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId='form-search-term'>
                <Form.Control type='text' placeholder='Search' onChange={(event) => this.handleSearchTermChange(event)} />
                {this.state.fetchingUsers &&
                  <div className='text-center'>
                    <Spinner
                      as='span'
                      animation='border'
                      size='lg'
                      role='status'
                      aria-hidden='true'
                      className='my-5'
                    />
                  </div>}
              </Form.Group>

              {
                this.state.searchResults &&

                <div>

                  {this.state.searchResults.length > 0 &&
                    <h3 className='my-4 px-4'>Search Results</h3>
                  }

                  <Row className='px-3 text-center'>
                    {(!this.state.resultsFound && this.state.searchTerm !== '') &&
                      <h4 className='margin-auto py-4'>No Users Found</h4>
                    }

                    {this.state.searchResults.map(user =>

                      <Col key={user.id} md={4} className="px-2 my-0">
                        <Card >
                          <Card.Img variant="top" src={user.profileImageUrl} className='img-fluid rounded-circle w-50 margin-auto mt-3' />
                          <Card.Body>
                            <Card.Title>
                              {user.fullName}
                            </Card.Title>
                            <Card.Text className='email-text'>
                              {user.email}
                            </Card.Text>

                            {this.props.type === 'friends' &&
                              <Button onClick={() => console.log('Friend Request Sent')}>
                                Send Friend Request
                              </Button>
                            }

                            {this.props.type === 'clubs' &&
                              <>
                                {this.state.addedUsers.includes(user) ?
                                  <Button variant='danger' onClick={() => this.removeUserFromCheckout(user)}>
                                    Remove from Club
                              </Button>
                                  :
                                  <Button onClick={() => this.addUserToCheckout(user)}>
                                    Add to Club
                              </Button>
                                }
                              </>
                            }
                          </Card.Body>
                        </Card>
                      </Col>
                    )}
                  </Row>
                </div>
              }

              {
                (this.state.addedUsers.length !== 0 && this.props.type === 'clubs') &&
                <div>
                  <h2 className='text-center my-4 px-4 '>Added Users</h2>
                  <Row className='text-center px-3'>
                    {this.state.addedUsers.map(user =>
                      <Col key={user.id} md={4} className="px-2 my-0">
                        <Card >
                          <Card.Img variant="top" src={user.profileImageUrl} className='img-fluid rounded-circle w-50 margin-auto mt-3' />
                          <Card.Body>
                            <Card.Title>
                              {user.fullName}
                            </Card.Title>
                            <Card.Text className='email-text'>
                              {user.email}
                            </Card.Text>

                            <Button variant='danger' onClick={() => this.removeUserFromCheckout(user)}>
                              Remove from Club
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    )}
                  </Row>
                </div>
              }

              {this.props.type === 'clubs' &&
                <>
                  {(this.state.resultsFound && this.state.searchResults.length > 0) &&
                    <div className='text-center mt-2'>
                      <Button className='text-center' variant='primary' onClick={() => this.handleSubmit()} >
                        Confirm
                      </Button>
                    </div>
                  }
                </>
              }
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}