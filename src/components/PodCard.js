import React from 'react';
import { Card, Button, Form, Col } from 'react-bootstrap';
import moment from 'moment'
import { setDateTimeFromForm, prefixZero, formatDateForInput, DateAndTimeSelector } from '../_helpers/DateTimeHelpers.js';

class PodCard extends React.Component {
  state = {
    pod: '',
    time_delivered: moment(),
    notes: '',
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
        [field.name]: prevState.time_delivered.set({
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
        [field.name]: prevState.time_delivered.set({
          "hour": hour,
          "minute": minute
        })
      }))
    }
  }

  handleComplete = () => {
    const newTicket = {...this.props.ticket};
    newTicket["is_complete"] = true;
    newTicket["time_delivered"] = this.state.time_delivered.format();
    newTicket.pod = this.state.pod

    this.props.handleComplete(newTicket)
  }

  render() {
    return (
      <Card id='complete-ticket-card' className='dropdown-inner'>
        <Card.Header>Complete Ticket #{this.props.ticket.id}</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group as={Col}>
              <Form.Row>
                <Form.Label>Recieved By:</Form.Label>
                <Form.Control
                  type='text'
                  name='pod'
                  value={this.state.pod}
                  onChange={e => this.setState({ pod: e.target.value })}
                />
              </Form.Row>
              <Form.Row>
                <Form.Label>Date:</Form.Label>
                <Form.Control
                  value={`${this.state.time_delivered.year()}-${prefixZero(this.state.time_delivered.month()+1)}-${prefixZero(this.state.time_delivered.date())}`}
                  type={'date'}
                  name={'date'}
                  onChange={this.setDateTimeFromForm}
                />
              </Form.Row>
              <Form.Row>
                <Form.Label>Time:</Form.Label>
                <Form.Control
                  value={`${prefixZero(this.state.time_delivered.hour())}:${prefixZero(this.state.time_delivered.minute())}`}
                  type={'time'}
                  name={'time'}
                  onChange={this.setDateTimeFromForm}
                />
              </Form.Row>
              <Form.Row>
                {
                  this.state.pod.length > 0
                  ?
                    <Button
                      variant={'success'}
                      onClick={() => {
                        document.getElementById('promptForPod').className='collapse'
                        document.getElementById(`ticketDetails-${this.props.ticket.id}`).className='collapse'
                        this.handleComplete();
                      }}
                    >
                      Complete Ticket
                    </Button>
                  :
                    <Button variant={'secondary'} diabled>Enter POD</Button>
                }
              </Form.Row>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    )
  }
}

export default PodCard;
