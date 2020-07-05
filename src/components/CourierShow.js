import React from 'react';
import { COURIERS_API } from '../_helpers/Apis.js';
import { Container, Card, Button, Accordion, Table, Form } from 'react-bootstrap';
import moment from 'moment';
import { NavLink } from 'react-router-dom';

import NewCourier from './NewCourier.js';

class CourierShow extends React.Component {
  state = {
    courier: {
      tickets: [],
      tickets_today: []
    },
    editFields: false
  }

  toggleEditFields = e => {
    e.persist();
    this.setState(prevState => ({ editFields: !prevState.editFields }))
  }

  handleChange = e => {
    e.persist();
    const value = e.target.value ? e.target.value : e.target.checked;
    const name = e.target.name;
    const courier = { ...this.state.courier }
    courier[name] = value
    this.setState({ courier })
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.handleSubmit(this.state.courier,
      this.setState({ editFields: false })
    )
  }

  showAllCourierTickets = () => {
    const start = moment('2000-01-1')
    const end = moment()
    this.props.handleSearch({
      startDate: start,
      endDate: end,
      courierName: this.state.courier.full_name
    })
  }

  componentWillMount() {
    const id = this.props.match.params.id
    fetch(COURIERS_API + `/${id}`)
    .then( res => res.json() )
    .then( courier => this.setState({ courier }) )
  }

  handleDelete = () => {
    this.props.deleteCourier(this.state.courier.id)
    this.props.history.push('/dispatch/couriers')
  }

  render() {
    const { full_name, first_name, last_name, email, phone, radio_number, is_archived, is_active, tickets, tickets_today, id } = this.state.courier;
    return (
      <Container fluid>
        <Card>
          <Card.Header>
            <h4>{this.state.courier.full_name} - Courier #{id}</h4>
          </Card.Header>
          <Card.Body>
            <Card.Title>
              <Form.Check
                type='switch'
                id='editToggle'
                checked={this.state.editFields}
                label='Edit Courier'
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
                              value={this.state.courier.first_name}
                              name='first_name'
                            />
                            <Form.Control
                              type='text'
                              value={this.state.courier.last_name}
                              name='last_name'
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>Email</th>
                          <td>
                            <Form.Control
                              type='text'
                              value={this.state.courier.email}
                              name='email'
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>Phone</th>
                          <td>
                            <Form.Control
                              type='text'
                              value={this.state.courier.phone}
                              name='phone'
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>Radio Number</th>
                          <td>
                            <Form.Control
                              type='number'
                              value={this.state.courier.radio_number}
                              name='radio_number'
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>Active?</th>
                          <td>
                            <Form.Check
                              type='switch'
                              checked={this.state.courier.is_active}
                              value={null}
                              label={this.state.courier.is_active ? 'Active' : 'Inactive'}
                              name='is_active'
                              id='is_active'
                            />
                          </td>
                        </tr>
                        <tr>
                          <th>Archived?</th>
                          <td>
                            <Form.Check
                              type='switch'
                              checked={this.state.courier.is_archived}
                              value={null}
                              label={this.state.courier.is_archived ? 'Archived' : 'Not Archived'}
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
                          <th>Delete Courier</th>
                          <td>
                            <Accordion>
                              <Accordion.Toggle
                                as={Button}
                                variant={'danger'}
                                eventKey={'deleteButton'}
                              >
                              DELETE COURIER
                            </Accordion.Toggle>
                            <Accordion.Collapse
                              eventKey={'deleteButton'}
                              >
                              <Card>
                                <Card.Header>Really Delete {first_name} {last_name}?</Card.Header>
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
                        <td>{first_name} {last_name}</td>
                      </tr>
                      <tr>
                        <th>Email</th>
                        <td>{email}</td>
                      </tr>
                      <tr>
                        <th>Phone</th>
                        <td>{phone}</td>
                      </tr>
                      <tr>
                        <th>Radio Number</th>
                        <td>{radio_number}</td>
                      </tr>
                      <tr>
                        <th>Active?</th>
                        <td>{is_active ? 'Yes' : 'No'}</td>
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
                  onClick={this.showAllCourierTickets}
                >
                  Show all Tickets for {full_name}
                </Button>
              </NavLink>
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    )
  }
}

export default CourierShow;
