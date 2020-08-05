import React, { Component } from 'react';
import { Button, Modal, Col, Row, Card } from 'react-bootstrap';

import '../styles/Modal.css';

export class ShowClubInvitesModal extends Component {

  constructor(props) {
    super(props)

    this.state = {
      showModal: false,
      fetchingInviteClubs: true,
      inviteRequestClubs: [],
    }
  }

  componentDidMount() {
    this.fetchInviteRequestClubs();
  }

  fetchInviteRequestClubs = async () => {

    this.setState({ fetchingInviteClubs: true });

    const inviteRequestClubs = await fetch(`/api/clubs?inviteIDs=${window.localStorage.getItem("userID")}`)
      .then(resp => resp.json())
      .catch(err => console.log(err));

    if (typeof inviteRequestClubs !== 'undefined') {
      this.setState({ inviteRequestClubs, fetchingInviteClubs: false });
    }
    else {
      this.setState({ fetchingInviteClubs: false });
    }
  }

  acceptInvite = (inviteClub) => {

    const userID = window.localStorage.getItem('userID');

    // Remove user from inviteIDs
    // Add user to memberIDs 
    const inviteClubUpdateJson = {
      id: inviteClub.id,
      remove_inviteIDs: userID,
      add_memberIDs: userID,
    }

    fetch("/api/clubs", {
      method: 'PUT',
      body: JSON.stringify(inviteClubUpdateJson),
    });

    this.props.updateMyClubs(inviteClub);

    const inviteRequestClubs = this.state.inviteRequestClubs.filter(club => club.id !== inviteClub.id);

    if (inviteRequestClubs.length === 0) {
      this.setState({ inviteRequestClubs, showModal: false });
    }
    else {
      this.setState({ inviteRequestClubs });
    }
  }

  limitDescription = (description) => {
    if (description.length > 50) {
      return description = description.substring(0, 50).concat('...');
    }
    return description;
  }


  render() {

    return (
      <div>
        <button className={this.props.btnStyle} onClick={() => this.setState({ showModal: true })}>
          <div className={this.props.textStyle}>
            <span> {this.props.text || 'Show Invite Requests'} </span>
          </div>
        </button>

        <Modal
          dialogClassName='modal-style'
          size='lg'
          show={this.state.showModal}
          onHide={() => {
            this.setState({ showModal: false, searchTerm: '', searchResults: [], });
          }}
          aria-labelledby='show-club-invites-modal'>

          <Modal.Header closeButton>
            <Modal.Title id='show-club-invites-modal'>
              {this.props.text || 'Invite Requests'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              {this.state.inviteRequestClubs.length > 0 ?
                <>
                  {this.state.inviteRequestClubs.map(inviteClub =>
                    <Col md={4} key={inviteClub.id}>
                      <Card>
                        <Card.Header>
                          <Card.Title className='text-muted mb-0 pb-0'>
                            {inviteClub.name}
                          </Card.Title>
                        </Card.Header>
                        <Card.Body>
                          <Card.Text className='text-center'>
                            {inviteClub.description ?
                              <>
                                {this.limitDescription(inviteClub.description)}
                                <Button className='mt-3' variant='success' onClick={() => this.acceptInvite(inviteClub)}>
                                  Accept Invite
                                </Button>
                              </>
                              :
                              <>
                                No provided description
                                <Button className='mt-3' variant='success' onClick={() => this.acceptInvite(inviteClub)}>
                                  Accept Invite
                                </Button>
                              </>}
                          </Card.Text>
                        </Card.Body>
                        <Card.Footer className='footer text-muted'>
                          {inviteClub.memberIDs.length} Members
                        </Card.Footer>
                      </Card>
                    </Col>
                  )}
                </>
                :
                <>
                </>}
            </Row>
          </Modal.Body>
        </Modal>
      </div >
    )
  }
}

