import React from 'react'
import { CLIENTS_API, INVOICES_API, HEADERS } from '../_helpers/Apis.js';
import { Container, Card, Button, Accordion, Table, Form } from 'react-bootstrap';
import moment from 'moment';
import { NavLink } from 'react-router-dom';

import InvoicePreview from './InvoicePreview.js'
import NewClient from './NewClient.js';

class ClientShow extends React.Component {
  state = {
    client: {
      tickets: [],
      tickets_today: [],
    },
    editFields: false
  }

  toggleEditFields = () => {
    this.setState(prevState => ({ editFields: !prevState.editFields }))
  }

  handleChange = e => {
    e.persist();
    const value = e.target.value ? e.target.value : e.target.checked;
    const name = e.target.name;
    const client = { ...this.state.client }
    client[name] = value;
    this.setState({ client })
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.handleSubmit(this.state.client,
      this.setState({ editFields: false })
    )
  }

  showAllClientTickets = () => {
    const start = moment('2000-01-01');
    const end = moment()
    this.props.handleSearch({
      startDate: start,
      endDate: end,
      clientName: this.state.client.name
    })
  }

  handleDelete = () => {
    this.props.handleDelete(this.state.client.id)
    this.props.history.push('/dispatch/clients')
  }

  componentWillMount() {
    const id = this.props.match.params.id;
    fetch(CLIENTS_API + `/${id}`)
    .then( res => res.json() )
    .then( client => this.setState({ client }))
  }

  render() {
    const { name, id, contact_person, contact_phone, address, is_archived, tickets, tickets_today, invoices } = this.state.client
    return (
      <Container fluid>
        <Card>
          <Card.Header>
            <h4>{this.state.client.name} - Client #{id}</h4>
          </Card.Header>
          <Card.Body>
            <Card.Title>
              <Form.Check
                type='switch'
                id='editToggle'
                checked={this.state.editFields}
                label='Edit Client'
                onChange={this.toggleEditFields}
              />
            </Card.Title>
            <Card.Text>
              {
                this.state.editFields
                ?
                  <Form onChange={this.handleChange} inline>
                    <Table striped hover>
                      <tbody>
                        <tr>
                          <th>Name</th>
                          <td>
                            <Form.Control
                              type='text'
                              value={this.state.client.name}
                              name='name'
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>Address</th>
                          <td>
                            <Form.Control
                              type='text'
                              value={this.state.client.address}
                              name='address'
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>Contact</th>
                          <td>
                            <Form.Control
                              type='text'
                              value={this.state.client.contact_person}
                              name='contact_person'
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>Phone</th>
                          <td>
                            <Form.Control
                              type='tel'
                              value={this.state.client.contact_phone}
                              name='contact_phone'
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>Archived?</th>
                          <td>
                            <Form.Check
                              type='switch'
                              checked={this.state.client.is_archived}
                              value={null}
                              label={this.state.client.is_archived ? 'Archived' : 'Not Archived'}
                              name='is_archived'
                              id='is_archived'
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>Submit Changes</th>
                          <td>
                            <Button
                              type='submit'
                              variant='primary'
                              onClick={this.handleSubmit}
                              block
                            >
                              Submit
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <th>Delete Client</th>
                          <td>
                            <Accordion>
                              <Accordion.Toggle
                                as={Button}
                                variant={'danger'}
                                eventKey={'deleteButton'}
                              >
                              DELETE CLIENT
                            </Accordion.Toggle>
                            <Accordion.Collapse
                              eventKey={'deleteButton'}
                              >
                              <Card>
                                <Card.Header>Really Delete {name}?</Card.Header>
                                <Card.Body>
                                  <Card.Title>This Can Not Be Undone!</Card.Title>
                                  <Card.Text>
                                    <Button
                                      variant='dark'
                                      block
                                      onClick={this.handleDelete}
                                    >
                                      CONFIRM DELETE
                                    </Button>
                                  </Card.Text>
                                </Card.Body>
                              </Card>
                            </Accordion.Collapse>

                            </Accordion>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Form>
                :
                  <Table striped hover>
                    <tbody>
                      <tr>
                        <th>Name</th>
                        <td>{name}</td>
                      </tr>
                      <tr>
                        <th>Address</th>
                        <td>{address}</td>
                      </tr>
                      <tr>
                        <th>Contact</th>
                        <td>{contact_person}</td>
                      </tr>
                      <tr>
                        <th>Phone</th>
                        <td>{contact_phone}</td>
                      </tr>
                      <tr>
                        <th>Archived?</th>
                        <td>{is_archived ? 'Yes' : 'No'}</td>
                      </tr>
                      <tr>
                        <th>Tickets Today</th>
                        <td>{tickets_today.length}</td>
                      </tr>
                      <tr>
                        <th>Tickets All-Time</th>
                        <td>{tickets.length}</td>
                      </tr>
                    </tbody>
                  </Table>
                }
              <NavLink to='/dispatch/tickets'>
                <Button
                  block
                  variant='info'
                  onClick={this.showAllClientTickets}
                >
                  Show all Tickets for {name}
                </Button>
              </NavLink>
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    )
  }
}

export default ClientShow
