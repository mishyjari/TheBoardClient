import React from 'react';
import { Container, Row, Form, Col, Button, Tab, Tabs, Accordion, Card } from 'react-bootstrap';
import moment from 'moment';

class NewInvoice extends React.Component {
  state = {
    selectedClient: 'Select Client',
    startDate: moment().subtract('months',1).startOf('month').startOf('day'),
    endDate: moment().subtract('months',1).endOf('month').endOf('day'),
  }

  prefixZero = num => {
    return Number(num) < 10 ? `0${num}` : num
  }

  formatDateForInput = d => {
    // Handle null args
    if (d){
      return `${d.year()}-${this.prefixZero(d.month()+1)}-${this.prefixZero(d.date())}`
    } else { return null }
  }

  setDateFromForm = (dateString,isEod) => {
    const d = dateString.split('-');
    return moment({'year': Number(d[0]), 'month': this.prefixZero(d[1])-1, 'day': this.prefixZero(d[2])})
  }

  dateSelector = callback => {
    const years = () => {
    	const years = [];
    	let year = 2000;
    	while ( year <= moment().year() ) {
    		years.push(year);
    		year += 1;
    	}
    	return years;
    }
    const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    return (
      <Container>
        <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>Month: </Form.Label>
          <Form.Control
            defaultValue={moment().format('MMM')}
            as="select"
            name={`month`}
            onChange={callback}
          >
          {
            months.map(mo => <option>{mo}</option>)
          }
          </Form.Control>
        </Form.Group>
        <Form.Group as={Col}>
        <Form.Label>Year: </Form.Label>
          <Form.Control
            defaultValue={moment().format('YYYY')}
            as="select"
            name={`year`}
            onChange={callback}
          >
          {
            years().map(y => <option>{y}</option>)
          }
          </Form.Control>
        </Form.Group>
      </Form.Row>
      </Container>
    )
  }

  invoiceAll = () => {
    this.props.clients.forEach(client => {
      this.props.handleSubmit({
        selectedClient: client.name,
        startDate: this.state.startDate,
        endDate: this.state.endDate
      })
    });
    document.getElementById('newInvoiceToggle').className='collapse'
  }

  render() {

    return (
      <Container fluid>
        <Form.Group as={Col}>
          <Form.Row>
            <Form.Label>
              Client Name
            </Form.Label>
            <Form.Control
              as='select'
              value={this.state.selectedClient}
              onChange={e => this.setState({ selectedClient: e.target.value })}
            >
              <option disabled>Select Client</option>
              {
                this.props.clients.map(client => <option>{client.name}</option>)
              }
            </Form.Control>
          </Form.Row>

          <Tabs>
            <Tab eventKey='selectDate' title='Select Date Range'>
              <Form.Row>
                  <h5>Start Date: </h5>
                  {this.dateSelector(e => {
                      e.persist();
                      const key = e.target.name;
                      const val = e.target.value;
                      this.setState(prevState => ({
                        startDate: prevState.startDate[key](val)
                      }))
                    }
                  )}
                  <h5>End Date:</h5>
                  {this.dateSelector(e => {
                      e.persist();
                      const key = e.target.name;
                      const val = e.target.value;
                      this.setState(prevState => ({
                        startDate: prevState.startDate[key](val)
                      }))
                    })
                  }
              </Form.Row>
            </Tab>
            <Tab eventKey='customDate' title='Custom Date Range'>
              <Col>
                <Form.Row>
                  <Form.Label>Start Date: </Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={this.formatDateForInput(this.state.startDate)}
                    onChange={e => this.setState({ startDate: this.setDateFromForm(e.target.value).startOf('day')})}
                  />
                </Form.Row>
                <Form.Row>
                  <Form.Label>End Date: </Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={this.formatDateForInput(this.state.endDate)}
                    onChange={e => this.setState({ endDate: this.setDateFromForm(e.target.value).endOf('day')})}
                  />
                </Form.Row>
              </Col>
            </Tab>
          </Tabs>

        </Form.Group>
        <Row>
          <Col>
        {
          this.state.selectedClient === 'Select Client'
          ?
            <Button variant='outline-secondary' block disabled>Select a Client</Button>
          :
            <Button block onClick={() => {
                this.props.handleSubmit(this.state);
                document.getElementById('newInvoiceToggle').className='collapse'
              }
            }
              >Submit</Button>
        }
      </Col><Col>
        <Accordion>
          <Accordion.Toggle
            as={Button}
            variant='info'
            eventKey='invoiceAll'
            block
          >
            Invoice ALL CLIENTS
          </Accordion.Toggle>
          <Accordion.Collapse eventKey='invoiceAll'>
            <Card>
              <Card.Header><h5>Confirm INVOICE ALL</h5></Card.Header>
              <Card.Body>
                <Card.Text>
                  <strong>Are you sure you want to create an invoice for ALL CLIENTS for the selected date range?</strong>
                  <Button variant='success' block onClick={this.invoiceAll}>Create Invoices</Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Accordion.Collapse>
        </Accordion>
      </Col>
      </Row>

      </Container>
    )
  }
}

export default NewInvoice
