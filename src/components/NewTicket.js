import React from "react";
import { Form, Col, Row, Button } from 'react-bootstrap';
import moment from 'moment'

class NewTicket extends React.Component {
  state = {
    id: 0,
    client_id: null,
    courier_id: null,
    time_ready: moment(),
    time_due: null,
    pickup: null,
    dropoff: null,
    is_rush: false,
    rush_details: null,
    is_oversize: null,
    oversize_details: null,
    notes: null,
    base_charge: null,
    rush_charge: null,
    oversize_charge: null,
    is_complete: false
  };

  handleSubmit = e => {
    e.preventDefault();
    console.log(e.target)
  }

  prefixZero = num => {
    return Number(num) < 10 ? `0${num}` : num
  }

  findClientIdByName = name => {
    const client = this.props.clients.find(client => {
      return client.name.toLowerCase() === name.toLowerCase()
    });

    return client ? client.id : null;
  }

  findCourierIdByName = name => {
    const courier = this.props.couriers.find(courier => {
      return courier.full_name.toLowerCase() === name.toLowerCase()
    })
    return courier ? courier.id : null;
  }

  findCourierNameById = id => {
    const courier = this.props.couriers.find(courier => courier.id == id)
    return courier ? courier.full_name : "Unassigned"
  }

  findClientNameById = id => {
    const client = this.props.clients.find(client => client.id == id)
    return client ? client.name : "Guest Account"
  }

  formatDateForInput = d => {
    // Handle null args
    if (d){
      return `${d.year()}-${this.prefixZero(d.month()+1)}-${this.prefixZero(d.date())}`
    } else { return null }
  }

  formatTimeForInput = t => {
    if (t){
      return `${this.prefixZero(t.hour())}:${this.prefixZero(t.minute())}`
    } else { return null }
  }

  getDefaultDueTime = () => {
    return this.state.isRush ? moment().add(90, 'minutes') : moment().add(3, 'hours')
  }

  setDateTimeFromForm = e => {
    // Form groups have seperate input fields for date and time.
    // These are indicated by 'type'
    // We can (using moment.js) update the datetime accordingly based on type and value
    const field = e.target;

    if ( field.type === 'date' ){
      // Value will be a string, lets break it down
      const date = field.value.split('-');
      const year = Number(date[0]);
      const month = Number(date[1]) - 1;
      const day = Number(date[2])

      this.setState(prevState => ({
        [field.name]: prevState.time_ready.set({
          "year": year,
          "month": month,
          "date": day
        })
      }))
    }
    else if ( field.type === 'time' ){
      const time = field.value.split(":");
      const hour = Number(time[0]);
      const minute = Number(time[1]);

      this.setState(prevState => ({
        [field.name]: prevState.time_ready.set({
          "hour": hour,
          "minute": minute
        })
      }))
    }
  }

  setPlainTextFromForm = e => {
    e.persist();
    const key = e.target.name;
    const val = e.target.value;

    this.setState({ [key]: val })
  }

  setNumberValueFromForm = e => {
    e.persist();
    const key = e.target.name;
    const val = e.target.value;

    this.setState({ [key]: Number(val) })
  }

  handleSubmitNewTicket = e => {
    e.preventDefault()
    this.props.handleNewTicket(this.state)
  }

  componentDidMount() {
    if (this.props.ticket){
      const data = this.props.ticket;
      data.time_due = moment(data.time_due)
      data.time_ready = moment(data.time_ready)
      this.setState(this.props.ticket)
    } else {
      this.setState({
        time_due: this.getDefaultDueTime()
      })
    }
  }


  render() {
    return (
      <Col className='content-main'>
      <Form onSubmit={this.handleSubmitNewTicket}>
      {/* Select Client */}
        <Form.Group
          controlId='newTicket.controlSelect1'
          onChange={e => this.setState(
            { client_id: this.findClientIdByName(e.target.value) }
          )}
        >
          <Form.Label>Select Client: </Form.Label>
          <Form.Control
            name='client_id'
            as='select'
            value={this.findClientNameById(this.state.client_id)}
          >
            <option>Guest Account</option>
            {
              this.props.clients.map(client => <option>{client.name}</option>)
            }
          </Form.Control>
        </Form.Group>

      {/* Select Courier */}
        <Form.Group
          controlId='newTicket.controlSelect2'
          onChange={e => this.setState(
            { courier_id: this.findCourierIdByName(e.target.value) }
          )}
        >
          <Form.Label>Assign to Courier? </Form.Label>
          <Form.Control
            name='courier_id'
            as='select'
            value={this.findCourierNameById(this.state.courier_id)}
          >
            <option>Unassigned</option>
            {
              this.props.couriers.map(courier => <option>{courier.full_name}</option>)
            }
          </Form.Control>
        </Form.Group>

      {/* Pickup Address */}
        <Form.Group
          controlId='newTicket.controlInput1'
          onChange={this.setPlainTextFromForm}
        >
          <Form.Label>Pickup Address: </Form.Label>
          <Form.Control
            type='textarea'
            value={this.state.pickup}
            name='pickup'
            placeHolder='Enter Full Address for Pickup'
          />
        </Form.Group>

      {/* Dropoff Address */}
        <Form.Group
          controlId='newTicket.controlInput2'
          onChange={this.setPlainTextFromForm}
        >
          <Form.Label>Dropoff Address: </Form.Label>
          <Form.Control
            type='textarea'
            value={this.state.dropoff}
            name='dropoff'
            placeHolder='Enter Full Address for Dropoff'
          />
        </Form.Group>

      {/* Time Ready - Default NOW */}
        <Form.Group
          controlId='newTicket.controlInput3'
          onChange={this.setDateTimeFromForm}
        >
          <Form.Label>Time Ready: </Form.Label>
          <Form.Control
            type='date'
            value={this.formatDateForInput(this.state.time_ready)}
            name="time_ready"
          />
          <Form.Control
            type='time'
            value={this.formatTimeForInput(this.state.time_ready)}
            name="time_ready"
          />
        </Form.Group>


      {/* Time Due - Default Ready + 3 Hours or 90min if Rush */}
        <Form.Group
          controlId='newTicket.controlInput3'
          onChange={this.setDateTimeFromForm}
        >
          <Form.Label>Time Due: </Form.Label>
          <Form.Control
            type='date'
            value={this.formatDateForInput(this.state.time_due)}
            name="time_due"
          />
          <Form.Control
            type='time'
            value={this.formatTimeForInput(this.state.time_due)}
            name="time_due"
          />
        </Form.Group>

      {/* Rush Details (according textarea) */}

      {/* Oversize Checkbox */}
      {/* Oversize details textarea */}

      {/* Base charge */}
        <Form.Group
          controlId='newTicket.controlInput4'
          onChange={this.setNumberValueFromForm}
        >
          <Form.Label>Base Charge: </Form.Label>
          <Form.Control
            type='number'
            value={this.state.base_charge}
            name='base_charge'
          />
        </Form.Group>
      {/* Rush charge - default if Rush = base*1.5, else hidden */}
      {/* OS Charge - default value maybe, hide if none */}

        <Form.Group>
          <Button
            type='submit'
            onClick={() => document.getElementById(`ticketDetails-${this.state.id}`).className='collapse'}

            >
            Submit
          </Button>
        </Form.Group>
      </Form>
    </Col>
    )
  }
}

export default NewTicket
