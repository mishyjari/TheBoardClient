import React from 'react';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import moment from 'moment';
import ReactLoading from 'react-loading';

class SearchForm extends React.Component {
  state = {
    courierName: 'Any Courier',
    clientName: 'Any Client',
    dateOption: 'Select Date By...',
    startDate: moment().startOf('day'),
    endDate: moment().endOf('day'),
    incomplete: true,
    complete: true,
    late: true,
    rush: true,
    os: true,
    rt: true
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

  handleChange = e => {
    e.persist();
    const key = e.target.name;
    const val = e.target.value;
    this.setState({ [key]: val })
  }

  toggleSwitchState = e => {
    e.persist();
    this.setState({ [e.target.name]: e.target.checked} )
  }

  setDateOption = e => {
    e.persist();
    const val = e.target.value;
    const newStartDate = val === "Today"
    ?
      moment().subtract('days', 1).startOf('day') :
    val === "This Week" ?
      moment().subtract('days', 7).startOf('day') :
    val === "This Month" ?
      moment().subtract('months', 1).startOf('day')
    :
      moment().subtract('years', 1).startOf('day')
    this.setState({
      dateOption: e.target.value,
      startDate: newStartDate,
      endDate: moment().endOf('day')
    })
  }

  render() {
    return (
      <Container fluid>
        <Form>
        <h4 className='title'>Search Tickets By...</h4>

          {/* Courier Search */}
          <Form.Row>
            <Form.Label>Courier: </Form.Label>
            <Form.Control
              name='courierName'
              as='select'
              value={this.state.courierName}
              onChange={e => this.setState({ courierName: e.target.value })}
            >
              <option>Any Courier</option>
              <option>Unassigned Tickets</option>
              {
                this.props.couriers.map(courier => {
                  return <option>{courier.full_name}</option>
                })
              }
            </Form.Control>
          </Form.Row>

          {/* Client Search */}
          <Form.Row>
              <Form.Label>Client: </Form.Label>
              <Form.Control
                name='clientName'
                as='select'
                value={this.state.clientName}
                onChange={e => this.setState({ clientName: e.target.value })}
              >
                <option>Any Client</option>
                <option>Guest Tickets</option>
                {
                  this.props.clients.map(client => {
                    return <option>{client.name}</option>
                  })
                }
              </Form.Control>
          </Form.Row>


          { /* Date Range */}
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Row>
                <Form.Label column lg>Select Date Range As:</Form.Label>
                <Form.Control
                  as="select"
                  name="dateOption"
                  value={this.state.dateOption}
                  onChange={this.setDateOption}
                  sm={"2"}
                >
                  <option>Select Date By...</option>
                  <option>Today</option>
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>This Year</option>
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
{/*
            <Form.Group as={Col}>
              <Form.Label>Filters: </Form.Label>
              <Form.Check
                type="switch"
                name="incomplete"
                id="incomplete"
                label="Incomplete Tickets"
                checked={this.state.incomplete}
                onChange={this.toggleSwitchState}
              />
              <Form.Check
                type="switch"
                name="complete"
                id="complete"
                label="Completed Tickets"
                checked={this.state.complete}
                onChange={this.toggleSwitchState}
              />
              <Form.Check
                type="switch"
                name="late"
                id="late"
                label="Late Deliveries"
                checked={this.state.late}
                onChange={this.toggleSwitchState}
              />
              <Form.Check
                type="switch"
                name="rush"
                id="rush"
                label="Rush Tickets"
                checked={this.state.rush}
                onChange={this.toggleSwitchState}
              />
              <Form.Check
                type="switch"
                name="os"
                id="os"
                label="Oversize Tickets"
                checked={this.state.os}
                onChange={this.toggleSwitchState}
              />
              <Form.Check
                type="switch"
                name="rt"
                id="rt"
                label="Round-trip Tickets"
                checked={this.state.rt}
                onChange={this.toggleSwitchState}
              />
            </Form.Group>
*/}
          </Form.Row>
          <Form.Row>
            <Button
              type='submit'
              onClick={e => {
                e.preventDefault()
                console.log(this.state)
                this.props.search(this.state)
              }}
            >
              Search
            </Button>
          </Form.Row>


        </Form>
        <Row>

        </Row>
      </Container>
    )
  }
}
export default SearchForm
