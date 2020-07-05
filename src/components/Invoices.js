import React from 'react';
import { Container, Row, Col, Form, Button, Table, Accordion, Dropdown, useAccordionToggle } from 'react-bootstrap';
import NewInvoice from './NewInvoice.js';
import InvoiceSearch from './InvoiceSearch.js';
import ViewInvoice from './ViewInvoice.js';
import InvoicePreview from './InvoicePreview.js';
import { INVOICES_API, UNPAID_INVOICES_API, CLIENTS_API, HEADERS } from '../_helpers/Apis.js';
import moment from 'moment';

class Invoices extends React.Component {
  state = {
    invoices: [],
    selectedClient: 'All Unpaid Invoices',
    selectedInvoiceId: null
  }

  handleNewInvoice = data => {
    data['client_id'] = this.props.clients.find(c => c.name === data.selectedClient).id
    console.log(data)
    fetch(INVOICES_API, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(data)
    })
    .then( res => res.json() )
    .then( invoice => {
      const invoices = [...this.state.invoices];
      invoices.unshift(invoice)
      this.setState({ invoices })
    }, () => document.getElementById('meow').className='collapse')
  }

  handleDelete = id => {
    fetch(`${INVOICES_API}/${id}`, {
      method: "DELETE",
      headers: HEADERS
    })
    .then( res => res.json() )
    .then( deletedInvoice => {
      console.log(deletedInvoice)
      const invoices = [...this.state.invoices]
      const oldInvoice = invoices.find(inv => {
        return inv.id == deletedInvoice.id
      });

      const index = invoices.indexOf(oldInvoice);
      invoices.splice(index,1)

      this.setState({ invoices })
    })
  }

  handleAdjustment = (invoice, newAdj) => {
    const inv = {...invoice};
    inv.adjustment = newAdj;
    this.updateInvoice(inv)
  }

  handleSearch = client_id => {
    //const client_id = this.props.clients.find(c => c.name === this.props.selectedClient.name).id

    fetch(`${CLIENTS_API}/${client_id}/invoices`)
    .then( res => res.json() )
    .then( invoices => this.setState({ invoices }))
  }

  updateInvoice = invoiceData => {

    fetch(`${INVOICES_API}/${invoiceData.id}`, {
      method: 'PATCH',
      headers: HEADERS,
      body: JSON.stringify(invoiceData)
    })
    .then( res => res.json() )
    .then( invoice => {
      console.log(invoice)
      const invoices = this.state.invoices;
      const oldInvoice = this.state.invoices.find(i => i.id == invoice.id)
      const index = invoices.indexOf(oldInvoice)

      invoices.splice(index,1,invoice)

      this.setState({ invoices })
    })
  }

  getBalance = tickets => {
    let balance = 0
    tickets.forEach(t => balance += Number(t.base_charge))
    return balance;
  }

  componentWillMount() {
    fetch(UNPAID_INVOICES_API)
    .then( res => res.json() )
    .then( invoices => this.setState({ invoices }))
  }
  render() {

    return (
      <Container fluid className='list-main'>
          <Accordion>
            <Row>
              <Col>
                <Accordion.Toggle
                  as={Button}
                  variant={'outline-dark'}
                  block
                  id={'newInvoice'}
                  eventKey={'newInvoice'}
                >
                  New Invoice
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={'newInvoice'}  id='meow'>
                  <NewInvoice
                    clients={this.props.clients}
                    handleSubmit={this.handleNewInvoice}
                  />
                </Accordion.Collapse>
              </Col>

              <Col>
                <Dropdown>
                  <Dropdown.Toggle block variant={'outline-secondary'} id={'search-invoice-toggle'}>
                    Show Invoices By Client
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {
                      this.props.clients.map(client => <Dropdown.Item
                        eventKey={client.id}
                        onClick={() => {
                          this.handleSearch(client.id)
                          this.setState({ selectedClient: client.name })
                          }
                        }>
                          {client.name}
                        </Dropdown.Item>)
                    }
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </Accordion>

            <Row>
              {
                this.state.selectedClient
                ?
                  <Table striped hover>
                    <h4 className='sub-sub-heading text-center'>{this.state.selectedClient}</h4>
                    <tr className='text-center'>
                      <th>Invoice Created</th>
                      <th>Client Name</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Adjustments</th>
                      <th>Balance</th>
                      <th>Num. Tickets</th>
                      <th>Paid?</th>
                      <td></td>
                    </tr>
                    <tbody>
                      {
                        this.state.invoices.length > 0
                        ?
                          this.state.invoices.map(i => <InvoicePreview
                            invoice={i}
                            balance={this.getBalance(i.tickets)}
                            togglePaid={this.updateInvoice}
                            handleDelete={this.handleDelete}
                            adjustment={this.handleAdjustment}
                          />)
                        :
                          <h4>Nothing To Show</h4>
                      }
                    </tbody>
                  </Table>
                  :
                    <h4>Select a client to view Invoices</h4>
                }
            </Row>

      </Container>
    )
  }
}

export default Invoices
