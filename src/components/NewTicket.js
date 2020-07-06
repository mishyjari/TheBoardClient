import React from "react";
import { Form, Col, Row, Button, Accordion, Card } from 'react-bootstrap';
import moment from 'moment'

class NewTicket extends React.Component {
  state = {
    id: 0,
    client_id: null,
    courier_id: null,
    time_ready: moment(),
    time_due: null,
    pickup: null,
    pickup_contact: null,
    pickup_details: null,
    dropoff: null,
    dropoff_contact: null,
    dropoff_details: null,
    is_rush: false,
    rush_details: null,
    is_oversize: false,
    oversize_details: null,
    notes: null,
    base_charge: 0,
    rush_charge: 0,
    oversize_charge: 0,
    is_complete: false,
    is_roundtrip: false,
    roundtrip_details: null,
    roundtrip_charge: 0,
    additional_charge: 0,
    notes: null
  };

  totalCharge = () => {
    const { roundtrip_charge, oversize_charge, rush_charge, additional_charge, base_charge } = this.state
    return (roundtrip_charge + oversize_charge + rush_charge + additional_charge + base_charge)
  }

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
      <Accordion>
        <Accordion.Toggle
          className='newTicketInnerToggle'
          as={Button}
          eventKey='pickup-info'
          variant='outline-dark'
          block
        >
          Pickup Information
        </Accordion.Toggle>
        <Accordion.Collapse
          eventKey='pickup-info'
        >
          <Card style={{
              padding: '10px',
              borderRadius: '0 0 20px 20px',
              boxShadow: '1px 2px 4px #fafafs',
              backgroundColor: '#fafafa'
            }}>
          <Form.Group
            controlId='newTicket.controlInput1'
            onChange={this.setPlainTextFromForm}
          >
            <Form.Label>Pickup Address: </Form.Label>
            <Form.Control
              type='text'
              value={this.state.pickup}
              name='pickup'
              placeHolder='Enter Full Address for Pickup'
            />
            <Form.Control
              type='text'
              value={this.state.pickup_contact}
              name='pickup_contact'
              placeHolder='Pickup Contact (name, phone, etc)'
            />
            <Form.Control
              as='textarea'
              value={this.state.pickup_details}
              name='pickup_details'
              placeHolder='Additional Pickup Details'
            />
          </Form.Group>
        </Card>
        </Accordion.Collapse>
      </Accordion>

      {/* Dropoff Address */}
      <Accordion>
        <Accordion.Toggle
          className='newTicketInnerToggle'
          as={Button}
          eventKey='pickup-info'
          variant='outline-dark'
          block
        >
          Dropoff Information
        </Accordion.Toggle>
        <Accordion.Collapse
          eventKey='pickup-info'
        >
          <Card style={{
              padding: '10px',
              borderRadius: '0 0 20px 20px',
              boxShadow: '1px 2px 4px #fafafs',
              backgroundColor: '#fafafa'
            }}>
          <Form.Group
            onChange={this.setPlainTextFromForm}
          >
            <Form.Label>Dropoff Address: </Form.Label>
            <Form.Control
              type='text'
              value={this.state.dropoff}
              name='dropoff'
              placeHolder='Enter Full Address for Dropoff'
            />
            <Form.Control
              type='text'
              value={this.state.dropoff_contact}
              name='dropoff_contact'
              placeHolder='Dropoff Contact (name, phone, etc)'
            />
            <Form.Control
              as='textarea'
              value={this.state.dropoff_details}
              name='dropoff_details'
              placeHolder='Additional Dropoff Details'
            />
          </Form.Group>
        </Card>
        </Accordion.Collapse>
      </Accordion>

      {/* Roundtrip Info */}
      <Accordion>
        <Accordion.Toggle
          className='newTicketInnerToggle'
          as={Button}
          eventKey='roundtrip-info'
          variant='outline-dark'
          block
        >
          Roundtrip
        </Accordion.Toggle>
        <Accordion.Collapse
          eventKey='roundtrip-info'
        >
          <Card style={{
              padding: '10px',
              borderRadius: '0 0 20px 20px',
              boxShadow: '1px 2px 4px #fafafs',
              backgroundColor: '#fafafa'
            }}>
          <Form.Group>
            <Form.Check
              label='Delivery is Roundtrip'
              type='switch'
              name='is_roundtrip'
              value={this.state.is_roundtrip}
              checked={this.state.is_roundtrip}
              id='roundtrip_check'
              onChange={() => this.setState(prevState => ({ is_roundtrip: !prevState.is_roundtrip }))}
            />
            {
              this.state.is_rush
              ?
                <Form.Control
                  as='textarea'
                  value={this.state.roundtrip_details}
                  name='roundtrip_details'
                  placeHolder='Roundtrip Details'
                  onChange={this.setPlainTextFromForm}
                />
              :
                null
            }

          </Form.Group>
        </Card>
        </Accordion.Collapse>
      </Accordion>

      {/* Time Ready - Default NOW */}
      <Accordion>
        <Accordion.Toggle
          className='newTicketInnerToggle'
          as={Button}
          eventKey='time-info'
          variant='outline-dark'
          block
        >
          Time Details
        </Accordion.Toggle>
        <Accordion.Collapse
          eventKey='time-info'
        >
          <Card style={{
              padding: '10px',
              borderRadius: '0 0 20px 20px',
              boxShadow: '1px 2px 4px #fafafs',
              backgroundColor: '#fafafa'
            }}>
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
              <Form.Check
                label='Rush Delivery'
                type='switch'
                name='is_rush'
                value={this.state.is_rush}
                checked={this.state.is_rush}
                id='oversize_check'
                onChange={() => this.setState(prevState => ({ is_rush: !prevState.is_rush }))}
              />
              {
                this.state.is_rush
                ?
                  <Form.Control
                    as='textarea'
                    value={this.state.rush_details}
                    name='rush_details'
                    placeHolder='Rush Details'
                    onChange={this.setPlainTextFromForm}
                  />
                :
                  null
              }
            </Form.Group>
          </Card>
        </Accordion.Collapse>
      </Accordion>

      {/* Oversize details textarea */}
      <Accordion>
        <Accordion.Toggle
          className='newTicketInnerToggle'
          as={Button}
          eventKey='time-info'
          variant='outline-dark'
          block
        >
          Oversize Details
        </Accordion.Toggle>
        <Accordion.Collapse
          eventKey='time-info'
        >
          <Card style={{
              padding: '10px',
              borderRadius: '0 0 20px 20px',
              boxShadow: '1px 2px 4px #fafafs',
              backgroundColor: '#fafafa'
            }}>
            <Form.Check
              label='Oversize Package'
              type='switch'
              name='is_oversize'
              value={this.state.is_oversize}
              checked={this.state.is_oversize}
              id='oversize_check'
              onChange={() => this.setState(prevState => ({ is_oversize: !prevState.is_oversize }))}
            />
            {
              this.state.is_oversize
              ?
                <Form.Control
                  as='textarea'
                  value={this.state.oversize_details}
                  name='oversize_details'
                  placeHolder='Oversize Details'
                  onChange={this.setPlainTextFromForm}
                />
              :
                null
            }
          </Card>
        </Accordion.Collapse>
      </Accordion>

      <Accordion>
        <Accordion.Toggle
          className='newTicketInnerToggle'
          as={Button}
          eventKey='notes'
          variant='outline-dark'
          block
        >
          Additional Notes
        </Accordion.Toggle>
        <Accordion.Collapse
          eventKey='notes'
        >
          <Card style={{
              padding: '10px',
              borderRadius: '0 0 20px 20px',
              boxShadow: '1px 2px 4px #fafafs',
              backgroundColor: '#fafafa'
            }}>
            <Form.Control
              as='textarea'
              name='notes'
              placeholder='Additonal Notes'
              value={this.state.notes}
              onChange={this.setPlainTextFromForm}
            />
          </Card>
        </Accordion.Collapse>
      </Accordion>

      {/* Base charge */}
      <Form.Row>
        <Form.Group
          as={Col}
          onChange={this.setNumberValueFromForm}
        >
          <Form.Label>Base Charge: </Form.Label>
          <Form.Control
            type='number'
            value={this.state.base_charge}
            name='base_charge'
          />
        </Form.Group>
        {
          this.state.is_roundtrip
          ?
            <Form.Group
              as={Col}
              onChange={this.setNumberValueFromForm}
            >
              <Form.Label>Roundtrip Charge: </Form.Label>
              <Form.Control
                type='number'
                value={this.state.roundtrip_charge}
                name='roundtrip_charge'
              />
            </Form.Group>
          :
            null
        }
        {
          this.state.is_rush
          ?
            <Form.Group
              as={Col}
              onChange={this.setNumberValueFromForm}
            >
              <Form.Label>Rush Charge: </Form.Label>
              <Form.Control
                type='number'
                value={this.state.rush_charge}
                name='rush_charge'
              />
            </Form.Group>
          :
            null
        }
        {
          this.state.is_oversize
          ?
            <Form.Group
              as={Col}
              onChange={this.setNumberValueFromForm}
            >
              <Form.Label>Oversize Charge: </Form.Label>
              <Form.Control
                type='number'
                value={this.state.oversize_charge}
                name='oversize_charge'
              />
            </Form.Group>
          :
            null
        }
        <Form.Group
          as={Col}
          onChange={this.setNumberValueFromForm}
        >
          <Form.Label>Additonal Charge: </Form.Label>
          <Form.Control
            type='number'
            value={this.state.additional_charge}
            name='additional_charge'
          />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <h5>Total Charge: ${this.totalCharge()}</h5>
      </Form.Row>
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
