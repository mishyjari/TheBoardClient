import React from 'react';
import { Form, Col, Row, Container, Button } from 'react-bootstrap';

class NewCourier extends React.Component {
  state = {
    first_name: null,
    last_name: null,
    email: null,
    phone: null,
    radio_number: null,
    is_active: false,
    is_archived: false
  }

  componentWillMount() {
    if ( this.props.courier ) {
      this.setState( this.props.courier )
    }
  }

  handleChange = e => {
    e.persist();

    const key = e.target.name;
    const val = e.target.value;

    e.target.isValid = true

    this.setState({ [key]: val })
  }

  handleSubmit = e => {
    e.preventDefault();

    if (this.props.courier){
      this.props.handleSubmit(this.state)
      this.props.handleClose()
    } else {
      this.props.handleSubmit(this.state)
    }
    document.getElementById('newCourierToggle').className='collapse'
  }

  render() {
    return (
      <Container fluid>
        {
          this.props.courier
          ?
            <h3 className='title'>Edit Courier Details</h3>
          :
            <h3 className='title'>New Courier</h3>
        }
        <Form
          onChange={this.handleChange}
          validation
        >
          <Form.Row>
            <Form.Group as={Col} controlId={'courierFirstName'}>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type='text'
                name='first_name'
                value={this.state.first_name}
                placeholder='Enter First Name' />
            </Form.Group>
            <Form.Group as={Col} controlId={'courierLastName'}>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type='text'
                name='last_name'
                value={this.state.last_name}
                placeholder='Enter Last Name' />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col} controlId={'courierPhone'}>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type='tel'
                name='phone'
                value={this.state.phone}
                placeholder='Enter Phone Number' />
            </Form.Group>
            <Form.Group as={Col} controlId={'courierEmail'}>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type='email'
                name='email'
                value={this.state.email}
                placeholder='Enter Email Address' />
            </Form.Group>
            <Form.Group as={Col} controlId={'courierRadio'}>
              <Form.Label>Radio Number</Form.Label>
              <Form.Control
                type='number'
                name='radio_number'
                value={this.state.radio_number} />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group>
              <Button
                type="submit"
                onClick={this.handleSubmit}
              >
                Submit
              </Button>
            </Form.Group>
          </Form.Row>
        </Form>
      </Container>
    )
  }
}


export default NewCourier;
