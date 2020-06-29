import React from 'react';
import ClientPreview from './ClientPreview.js';
import NewClient from '../components/NewClient.js'
import { Table, Accordion, Button, Container, Row, Col, Form } from 'react-bootstrap';

class ClientList extends React.Component {

  state = {
    filter: '',
    colSort: 'first_name',
    sortOrderDesc: false
  }

  handleFilter = e => {
    e.persist();
    const val = e.target.value;

    this.setState({
      filter: val.toLowerCase()
    }, () => {
      this.props.filterClients(client => {
        const { name, address, contact_phone, contact_person } = client;
        const filter = this.state.filter;
        return name.toLowerCase().includes(filter)
          || address.toLowerCase().includes(filter)
          || contact_phone.includes(filter)
          || contact_person.toLowerCase().includes(filter)
      })
    })
  }


  render() {
    return (
      <Container fluid>
        <Row>
          <Col sm='3'>
            <Form.Control
              type='text'
              name='filterClients'
              placeholder='Filter Clients'
              value={this.state.filter}
              onChange={this.handleFilter}
            />
          </Col>
          <Col>
            <Accordion>
              <Accordion.Toggle
                as={Button}
                variant={'outline-dark'}
                eventKey={'newClient'}
                block
              >
                New Client
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={'newClient'} id={'newCourierToggle'}>
                <NewClient handleSubmit={() => alert('meow')} clients={this.props.clients}/>
              </Accordion.Collapse>
            </Accordion>
          </Col>
        </Row>





      <Table hover striped>
        <tr>
          <th>Name</th>
          <th>Address</th>
          <th>Phone</th>
          <th>Contact Person</th>
          <th></th>
        </tr>
        <tbody>
        {
          this.props.clients.map(client => <ClientPreview {...client} />)
        }
        </tbody>
      </Table>
      </Container>
    )
  }
}

export default ClientList
