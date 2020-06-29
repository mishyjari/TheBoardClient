import React from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { SESSIONS_API } from "../_helpers/Apis.js"
import { Redirect } from 'react-router-dom';

//const SESSIONS_API = 'http://localhost:3000/sessions'
const HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

class Login extends React.Component {
  state = {
    usernameOrEmail: '',
    password: '',
    saveSession: false
  };

  handleChange = e => {
    e.persist();
    let { name, value } = e.target;
    value = name === 'saveSession' ? !this.state.saveSession : value
    this.setState({ [name]: value });
  };

  handleLogin = e => {
    e.preventDefault();
    console.log(this.state)
    fetch(SESSIONS_API, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(this.state)
    })
    .then( res => {
      return res.status === 200 ? res.json() : null
    })
    .then( user => {
      if ( user )
        {
          this.props.setUser(user, this.state.saveSession)
          return <Redirect to={`${user.user_type}Home/${user.id}`} />
        }
      else { alert('User not found') }
    })
  };

  render() {
    return (
      <Form
        onChange={this.handleChange}
      >
        <Form.Group>
          <Form.Row>
            <Form.Label>
              Username or Email Address
            </Form.Label>
            <Form.Control
              type='text'
              name='usernameOrEmail'
              value={this.state.usernameOrEmail}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label>
              Password
            </Form.Label>
              <Form.Control
                type='password'
                name='password'
                value={this.state.password}
              />
          </Form.Row>
          <Form.Row>
            <Form.Check
              custom
              inline
              id="saveSession"
              label="Keep me signed in"
              name='saveSession'
              checked={this.state.saveSession}
            />
          </Form.Row>
          <Form.Row>
            <Button
              type='submit'
              onClick={this.handleLogin}
            >
              Login
            </Button>
          </Form.Row>
        </Form.Group>
      </Form>
    )
  }
};

export default Login;
