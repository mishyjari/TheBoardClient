import React from 'react';
import moment from 'moment';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';

class InvoiceSearch extends React.Component {
  state = {
    selectedClient: 'Guest Account',
    startDate: moment().subtract('months',1).startOf('day'),
    endDate: moment().endOf('day'),
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

  handleSearch = () => {
      this.props.handleSearch()
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
              <option>All Clients</option>
              <option>Guest Accounts</option>
              {
                this.props.clients.map(client => <option>{client.name}</option>)
              }
            </Form.Control>
          </Form.Row>
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
        </Form.Group>
        <Button onClick={() => alert('meow')}>Submit</Button>
      </Container>
    )
  }
}

export default InvoiceSearch;
