import React from 'react';
import { Container, Form, Col, Button } from 'react-bootstrap';

class NewClient extends React.Component {

  state = {
    name: '',
    address: '',
    contact_person: '',
    contact_phone: ''
  }

  handleChange = e => {
    e.persist();
    const { name, value } = e.target;
    this.setState({ [name]: value })
  }

  handleSubmit = e => {
    e.preventDefault();
    if ( this.props.client ){
      this.props.handleEditClient(this.state)
      this.setState({
        name: '',
        address: '',
        contact_person: '',
        contact_phone: ''
      })
    } else {
      this.props.handleNewClient(this.state)
    }
  }

  componentDidMount() {
    if ( this.props.client ) {
      this.setState( this.props.client )
    }
  }

  render() {
    return (
      <Container fluid>
        {
          this.props.client
          ?
            <h3 className='title'>Edit Client Details</h3>
          :
            <h3 className='title'>New Client</h3>
        }
        <Form
          onChange={this.handleChange}
          validation
        >
          <Form.Group as={Col}>

            <Form.Row>
              <Form.Label>
                Client Name
              </Form.Label>
              <Form.Control
                name='name'
                value={this.state.name}
                type='text'
                plachonder='Company McComperson, LLC'
              />
            </Form.Row>

            <Form.Row>
              <Form.Label>
                Client Address
              </Form.Label>
              <Form.Control
                name='address'
                value={this.state.address}
                type='text'
                plachonder='1 Main St'
              />
            </Form.Row>

            <Form.Row>
              <Form.Label>
                Contact Person
              </Form.Label>
              <Form.Control
                name='contact_person'
                value={this.state.contact_person}
                type='text'
                plachonder='Person McPerson'
              />
            </Form.Row>

            <Form.Row>
              <Form.Label>
                Contact Phone
              </Form.Label>
              <Form.Control
                name='contact_phone'
                value={this.state.contact_phone}
                type='tel'
                plachonder='867-5309'
              />
            </Form.Row>

            <Form.Row>
              <Button
                type='submit'
                onClick={e => {
                  this.handleSubmit(e);
                  this.props.close()
                }
                }
              >
                Submit
              </Button>
            </Form.Row>

          </Form.Group>
        </Form>
      </Container>
    )
  }
}

export default NewClient
