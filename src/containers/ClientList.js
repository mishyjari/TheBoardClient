import React from 'react';
import ClientPreview from './ClientPreview.js';
import NewClient from '../components/NewClient.js';
import ClientShow from '../components/ClientShow.js';
import { Table, Accordion, Button, Container, Row, Col, Form } from 'react-bootstrap';
import { Route } from 'react-router-dom';

class ClientList extends React.Component {

  state = {
    filter: '',
    colSort: 'name',
    sortOrderDesc: false,
    selectedTicket: null,
    showArchived: false,
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
      }, this.state.showArchived)
    })
  }

  handleSort = col => {
    const willToggle = col === this.state.colSort;

    this.setState(prevState => ({
      colSort: col,
      sortOrderDesc : willToggle ? !prevState.sortOrderDesc : prevState.sortOrderDesc
    }), () => {
      this.props.sortClients(this.state.colSort, this.state.sortOrderDesc)
    })
  }

  render() {
    return (
      <Container fluid className='list-main'>

        <Route exact path='/dispatch/clients/:id' render={routerProps => <ClientShow
          {...routerProps}
          handleSubmit={this.props.editClient}
          handleDelete={this.props.deleteClient}
          handleSearch={this.props.handleSearch}
            />
        } />

        <Route exact path='/dispatch/clients'>
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
                  eventKey={'newClientToggle'}

                  block
                >
                  New Client
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={'newClientToggle'} id={'newClientToggle'}>
                  <NewClient
                    handleNewClient={this.props.newClient}
                    clients={this.props.clients}
                    close={() => document.getElementById('newClientToggle').className='collapse'}
                    />
                </Accordion.Collapse>
              </Accordion>
            </Col>
          </Row>
          <Row>
            <Form.Check
              type='switch'
              label='Include Archived Clients'
              name='showArchivedClients'
              id='showArchiveClientsToggle'
              checked={this.state.showArchived}
              onChange={() => this.setState(prevState => ({
                showArchived: !prevState.showArchived}),
                () => this.props.toggleShowArchived(this.state.showArchived))}
            />
          </Row>
          <Table hover striped>
            <tr>
              <th className='hover-pointer' onClick={() => this.handleSort('name')}>Name</th>
              <th className='hover-pointer' onClick={() => this.handleSort('address')}>Address</th>
              <th className='hover-pointer' onClick={() => this.handleSort('contact_phone')}>Phone</th>
              <th className='hover-pointer' onClick={() => this.handleSort('contact_person')}>Contact Person</th>
              <th></th>
            </tr>
            <tbody>
            {
              this.props.filteredClients.map(client => <ClientPreview
                client={client}
                handleEdit={this.props.editClient}
                handleDelete={this.props.deleteClient}
              />)
            }
            </tbody>
          </Table>
        </Route>
      </Container>
    )
  }
}

export default ClientList
