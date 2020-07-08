import React from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import moment from 'moment';

class TicketEdit extends React.Component {

  state = {}

  handleChangeText = e => {
    e.persist();
    const { name, value } = e.target;
    this.setState({ [name]: value })
  }

  handleChangeBoolean = e => {
    e.persist();
    const { name } = e.target;
    this.setState(prevState => ({ [name]: !prevState[name] }), console.log(this.state))
  }

  handleChangeCourier = e => {
    e.persist();
    const courier = this.props.couriers.find(c => c.full_name == e.target.value)
    this.setState({
      courier: courier ? courier : null,
      courier_id: courier ? courier.id : null
    })
  }

  getCourierNameById = id => {
    const courier = this.props.couriers.find(c => c.id == id);
    return courier ? courier.full_name : 'Unassigned'
  }

  handleChangeClient = e => {
    e.persist();
    const client = this.props.clients.find(c => c.name == e.target.value)
    this.setState({
      client: client ? client : null,
      client_id: client ? client.id : null
    })
  }

  getClientNameById = id => {
    const client = this.props.clients.find(c => c.id == id);
    return client ? client.name : 'Guest Account'
  }

  handleChangeCharge = e => {
    const { name, value } = e.target;
    const { base_charge, roundtrip_charge, oversize_charge, rush_charge, additional_charge } = this.state;
    this.setState({
      [name]: Number(value),
      total_charge: ( base_charge + roundtrip_charge + oversize_charge + rush_charge + additional_charge )
    })
  }

  prefixZero = num => {
    return Number(num) < 10 ? `0${num}` : num
  }

  formatDateForInput = d => {
    // Handle null args
    if (d){
      d = moment(d)
      return `${d.year()}-${this.prefixZero(d.month()+1)}-${this.prefixZero(d.date())}`
    } else { return null }
  }

  formatTimeForInput = t => {
    if (t){
      t = moment(t)
      return `${this.prefixZero(t.hour())}:${this.prefixZero(t.minute())}`
    } else { return null }
  }

  setDateTimeFromForm = e => {
    // Form groups have seperate input fields for date and time.
    // These are indicated by 'type'
    // We can (using moment.js) update the datetime accordingly based on type and value
    const field = e.target;
    const name = field.name;

    if ( field.type === 'date' ){
      // Value will be a string, lets break it down
      const date = field.value.split('-');
      const year = Number(date[0]);
      const month = Number(date[1]) - 1;
      const day = Number(date[2])

      this.setState(prevState => ({
        [field.name]: prevState[name].set({
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
        [field.name]: prevState[name].set({
          "hour": hour,
          "minute": minute
        })
      }))
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.handleUpdate(this.state, this.props.closeForm())
  }

  componentWillMount() {
    const ticket = {...this.props.ticket};
    ticket.created_at = moment(ticket.created_at);
    ticket.time_due = moment(ticket.time_due);
    ticket.time_ready = moment(ticket.time_ready);
    ticket.time_delivered = moment(ticket.time_delivered);

    this.setState( ticket, () => {
      const courierName = this.props.couriers.find(c => c.id == this.state.courier_id);
      const clientName = this.props.clients.find(c => c.id == this.state.client_id);
      this.setState({
        clientName: clientName ? clientName.name : 'Guest Account',
        courierName: courierName ? courierName.full_name : 'Unassigned',
      })
    })
  }

  render() {

    const {
      pickup,
      pickup_details,
      pickup_contact,
      dropoff,
      dropoff_details,
      dropoff_contact,
      is_rush,
      rush_details,
      rush_charge,
      is_oversize,
      oversize_details,
      oversize_charge,
      is_roundtrip,
      roundtrip_details,
      roundtrip_charge,
      base_charge,
      additional_charge,
      total_charge,
      created_at,
      time_ready,
      time_due,
      time_delivered,
      is_complete,
      pod,
      id,
      client,
      client_id,
      courier,
      courier_id,
      notes
    } = this.state;

    const totalCharge = ( Number(base_charge) + Number(roundtrip_charge) + Number(oversize_charge) + Number(rush_charge) + Number(additional_charge) )
    return (
      <Container>
      <Form>
        <Row>
          <Col>
            <Table striped hover>
              <tbody>
                <tr>
                  <th>Ordered</th>
                  <td>{moment(created_at).format("L, LT")}</td>
                </tr>
                <tr>
                  <th>Ready</th>
                  <td>
                    <Form.Group
                      onChange={this.setDateTimeFromForm}
                    >
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
                  </td>
                </tr>
                <tr>
                  <th>Due</th>
                  <td>
                    <Form.Group
                      onChange={this.setDateTimeFromForm}
                    >
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
                  </td>
                </tr>
                <tr>
                  <th>Rush?</th>
                  <td><Form.Check
                    type='switch'
                    id='rush-switch'
                    checked={this.state.is_rush}
                    name='is_rush'
                    onChange={this.handleChangeBoolean}
                    label={'Rush'}
                  /></td>
                </tr>
                {
                  this.state.is_rush
                  ?
                    <tr>
                      <th>Rush Details</th>
                      <td><Form.Control
                        as='textarea'
                        value={rush_details}
                        name={'rush_details'}
                        onChange={this.handleChangeText}
                      />
                      </td>
                    </tr>
                  :
                    null
                }
                <tr>
                  <th>Delivered</th>
                  <td>
                    {
                      time_delivered
                      ?
                        ''
                      :
                        'No'
                    }
                  </td>
                </tr>
                <tr>
                  <th>Courier</th>
                  <td>
                    <Form.Control
                      as='select'
                      name='courier_name'
                      value={this.getCourierNameById(courier_id)}
                      onChange={this.handleChangeCourier}
                    >
                      <option>Unassigned</option>
                      {
                        this.props.couriers.map(c => <option>{c.full_name}</option>)
                      }
                    </Form.Control>
                  </td>
                </tr>
                <tr>
                  <th>Oversize?</th>
                  <td><Form.Check
                    type='switch'
                    id='os-switch'
                    checked={this.state.is_oversize}
                    name='is_oversize'
                    onChange={this.handleChangeBoolean}
                    label={'Oversize'}
                  /></td>
                </tr>
                {
                  is_oversize
                  ?
                    <tr>
                      <th>Oversize Details</th>
                      <td><Form.Control
                        as='textarea'
                        name={'oversize_details'}
                        value={oversize_details}
                        onChange={this.handleChangeText}
                      />
                      </td>
                    </tr>
                  :
                    null
                }
                <tr>
                  <th>Roundtrip?</th>
                  <td><Form.Check
                    type='switch'
                    id='rt-switch'
                    checked={this.state.is_roundtrip}
                    name='is_roundtrip'
                    onChange={this.handleChangeBoolean}
                    label={'Roundtrip'}
                  /></td>
                </tr>
                {
                  is_roundtrip
                  ?
                    <tr>
                      <th>Roundtrip Details</th>
                      <td><Form.Control
                        as='textarea'
                        name={'roundtrip_details'}
                        value={roundtrip_details}
                        onChange={this.handleChangeText}
                      />
                      </td>
                    </tr>
                  :
                    null
                }
              </tbody>
            </Table>
            <h6>Notes:</h6>
            <p><Form.Control
              as='textarea'
              name={'notes'}
              value={notes}
              onChange={this.handleChangeText}
            /></p>
          </Col>
          <Col>
            <Table striped hover>
              <tbody>
                <tr>
                  <th>Client</th>
                  <td>
                    <Form.Control
                      as='select'
                      name='client_name'
                      value={this.getClientNameById(client_id)}
                      onChange={this.handleChangeClient}
                    >
                      <option>Guest Account</option>
                      {
                        this.props.clients.map(c => <option>{c.name}</option>)
                      }
                    </Form.Control>
                  </td>
                </tr>
                <tr>
                  <th>Pickup Address</th>
                  <td><Form.Control
                    type='text'
                    name={'pickup'}
                    value={pickup}
                    onChange={this.handleChangeText}
                  /></td>
                </tr>
                <tr>
                  <th>Pickup Contact</th>
                  <td><Form.Control
                    type='text'
                    name={'pickup_contact'}
                    value={pickup_contact}
                    onChange={this.handleChangeText}
                  /></td>
                </tr>
                <tr>
                  <th>Pickup Details</th>
                  <td><Form.Control
                    as='textarea'
                    name={'pickup_details'}
                    value={pickup_details}
                    onChange={this.handleChangeText}
                  /></td>
                </tr>
                <tr>
                  <th>Dropoff</th>
                  <td><Form.Control
                    type='text'
                    name={'dropoff'}
                    value={dropoff}
                    onChange={this.handleChangeText}
                  /></td>
                </tr>
                <tr>
                  <th>Dropoff Contact</th>
                  <td><Form.Control
                    type='text'
                    name={'dropoff_contact'}
                    value={dropoff_contact}
                    onChange={this.handleChangeText}
                  /></td>
                </tr>
                <tr>
                  <th>Dropoff Details</th>
                  <td><Form.Control
                    as='textarea'
                    name={'dropoff_details'}
                    value={dropoff_details}
                    onChange={this.handleChangeText}
                  /></td>
                </tr>
                <tr>
                  <th>Recieved By</th>
                  <td><Form.Control
                    type='text'
                    name={'pod'}
                    value={pod}
                    onChange={this.handleChangeText}
                  /></td>
                </tr>
              </tbody>
            </Table>

            <Table>
              <tbody>
                <tr>
                  <th>Base Charge</th>
                  <th>Additional Charge</th>
                  {
                    is_rush
                    ?
                      <th>Rush Charge</th>
                    :
                      null
                  }
                  {
                    is_roundtrip
                    ?
                      <th>Roundtrip Charge</th>
                    :
                      null
                  }
                  {
                    is_oversize
                    ?
                      <th>Oversize Charge</th>
                    :
                      null
                  }
                  <th>Total Charge</th>
                </tr>
                <tr>
                  <td>
                    <Form.Control
                      type='number'
                      name='base_charge'
                      value={this.state.base_charge}
                      onChange={this.handleChangeText}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type='number'
                      name='additional_charge'
                      value={this.state.additional_charge}
                      onChange={this.handleChangeText}
                    />
                  </td>
                  {
                    is_rush
                    ?
                      <td>
                        <Form.Control
                          type='number'
                          name='rush_charge'
                          value={this.state.rush_charge}
                          onChange={this.handleChangeText}
                        />
                      </td>
                    :
                      null
                  }
                  {
                    is_roundtrip
                    ?
                      <td>
                        <Form.Control
                          type='number'
                          name='roundtrip_charge'
                          value={this.state.roundtrip_charge}
                          onChange={this.handleChangeText}
                        />
                      </td>
                    :
                      null
                  }
                  {
                    is_oversize
                    ?
                      <td>
                        <Form.Control
                          type='number'
                          name='oversize_charge'
                          value={this.state.oversize_charge}
                          onChange={this.handleChangeText}
                        />
                      </td>
                    :
                      null
                  }
                  <td><strong>${totalCharge}</strong></td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Button
            block
            type='submit'
            onClick={this.handleSubmit}
          >
            SUBMIT
          </Button>
        </Row>
      </Form>
      </Container>
    )
  }
}

export default TicketEdit
