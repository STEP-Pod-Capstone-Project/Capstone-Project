import React, { Component } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import '../styles/Groups.css';

class CreateClub extends Component {
  handleSubmit = (e) => {
    const history = this.props.history;
    e.preventDefault();
    let data = {};
    const formElements = document.getElementById("create-club-form").elements;
    for (let i = 0; i < formElements.length; i++) {
      if (formElements[i].name.length !== 0 && 
          formElements[i].type !== "submit" && formElements[i].value.length !== 0) {
        data[formElements[i].name] = formElements[i].value;
      }
    }
    data.ownerID = window.localStorage.getItem("userID");

    fetch("https://8080-bbaec244-5a54-4467-aed6-91c386e88c1a.ws-us02.gitpod.io/api/clubs", {method: "post", body: JSON.stringify(data)})
        .then(resp => resp.json())
        .then(club => history.push(`/clubpage/${club.id}`))
        .catch(function(e) {
          console.log(e);
          alert("Looks like we're having trouble connecting to our database, hang tight!");
        });  
  }

  addMembers = () => {
    //TODO #91: Add members modal
  }

  render() {
    return (
      <div className="page-container">
        <Row>
          <Col xs={12} className="title"> Create a Club </Col>
        </Row>
        <Form onSubmit={this.handleSubmit} id="create-club-form">
          <Form.Group>
            <Form.Label> Club Name </Form.Label>
            <Form.Control name="name" type="text" placeholder="Enter club name..." />
          </Form.Group>
          <Form.Group>
            <Form.Label> Club Description </Form.Label>
            <Form.Control name="description" as="textarea" rows="3" placeholder="Enter club description..." />
          </Form.Group>
          <Row>
            {/* <Col xs={12}>
               <Button variant="secondary" id="add-members" onClick={this.addMembers}> Add Members </Button> 
            </Col> */}
          </Row>
          <Row>
            <Col xs={12}>
              <Button variant="primary" id="create-club" type="submit"> Create Club </Button>
            </Col>
          </Row>      
        </Form>
      </div>
    );
  }
}

export default withRouter(CreateClub);