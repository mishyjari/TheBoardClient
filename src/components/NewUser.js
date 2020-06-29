import React from 'react'
import { Container, Form, Row, Col, Button } from 'react-bootstrap';

const USERS_API = 'http://localhost:3000/users'
const HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

class NewUser extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: '',
  };

  handleChange = e => {
    e.persist();
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = e => {
    e.preventDefault();
    if ( this.state.password === this.state.confirmPassword ){
      fetch(USERS_API, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify(this.state)
      })
      .then( res => res.json() )
      .then( console.log )
    } else {
      alert('Passwords Do Not Match!')
    }
  };

  render() {
    return (
      <Form onChange={this.handleChange}>
        <Form.Group as={Col}>

          <Form.Row>
            <Form.Label>
              User Type
            </Form.Label>
            <Form.Control
              as='select'
              name='userType'
              value={this.state.userType}
            >
              <option>Client</option>
              <option>Courier</option>
              {
                this.props.admin
                ?
                  <option>Dispatcher</option>
                :
                  <option disabled>Dispatcher</option>
              }

            </Form.Control>
          </Form.Row>

          <Form.Row>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              name='email'
              placeholder='email@example.com'
              value={this.state.email}
            />
          </Form.Row>

          <Form.Row>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type='text'
              name='username'
              placeholder='superCoolUsername'
              value={this.state.username}
            />
          </Form.Row>

          <Form.Row>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              name='password'
              value={this.state.password}
            />
          </Form.Row>

          <Form.Row>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              name='confirmPassword'
              value={this.state.confirmPassword}
            />
          </Form.Row>

          <Form.Row>
            <Button
              type='submit'
              onClick={this.handleSubmit}
            >
              Submit
            </Button>
          </Form.Row>
        </Form.Group>
      </Form>
    )
  }
}

export default NewUser
