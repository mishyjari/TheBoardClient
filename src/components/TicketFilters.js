import React from 'react';
import { Container, Form, Row, Col } from 'react-bootstrap';
import moment from 'moment';

class TicketFilters extends React.Component {

  state = {
    selectedFilter: 'incomplete-unassigned'
  }

  handleChange = e => {
    e.persist();
    const selectedFilter = e.target.name;
    const heading = e.target.id
    this.setState({ selectedFilter }, () => {
      const filterTickets = this.props.filterTickets;
      const filter = this.state.selectedFilter;

      if ( filter === 'incomplete-unassigned' ) {
        filterTickets((ticket => (!ticket.is_complete || !ticket.courier_id)), heading)
      }
      else if ( filter === "incomplete" ) {
        filterTickets( (ticket => !ticket.is_complete), heading )
      }
      else if ( filter === "completed" ) {
        filterTickets( (ticket => ticket.is_complete), heading )
      }
      else if ( filter === "unassigned" ) {
        filterTickets( (ticket => !ticket.courier_id), heading )
      }
      else if ( filter === "today" ) {
        filterTickets( (ticket => (
          moment(ticket.created_at).isSame(moment(), 'day') ||
          moment(ticket.time_ready).isSame(moment(), 'day') ||
          moment(ticket.time_due).isSame(moment(), 'day'))
        ), heading)
      }
    });
    document.getElementById('searchToggle').className='collapse'
  }

  render() {

    return (
      <Container>
        <Form onChange={this.handleChange} value={this.state.selectedFilter}>
          <Form.Check
            custom
            type='radio'
            label='Incomplete and Unassigned Tickets'
            name='incomplete-unassigned'
            id='Incomplete and Unassigned Tickets'
            checked={this.state.selectedFilter === 'incomplete-unassigned'}
          >
          </Form.Check>
          <Form.Check
            custom
            type='radio'
            label='All Tickets Today'
            name='today'
            id='All Tickets Today'
            checked={this.state.selectedFilter === 'today'}
          >
          </Form.Check>
          <Form.Check
            custom
            type='radio'
            label='Completed Tickets Today'
            name='completed'
            id='Completed Tickets Today'
            checked={this.state.selectedFilter === 'completed'}
          >
          </Form.Check>
          <Form.Check
            custom
            type='radio'
            label='Unassigned Tickets Only'
            name='unassigned'
            id='Unassigned Tickets Only'
            checked={this.state.selectedFilter === 'unassigned'}
          >
          </Form.Check>
          <Form.Check
            custom
            type='radio'
            label='Incomplete Tickets Only'
            name='incomplete'
            id='Incomplete Tickets Only'
            checked={this.state.selectedFilter === 'incomplete'}
          >
          </Form.Check>
        </Form>
      </Container>
    )
  }
}

export default TicketFilters
