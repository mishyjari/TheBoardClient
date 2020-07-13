import React from 'react';
import { Form, Container } from 'react-bootstrap';
import TicketFilters from './TicketFilters.js';

class FilterTicketsForm extends React.Component {

  state = {
    selectedFilter: 'All Tickets'
  }
  sort = val => {
    val = val.split('|')
    //const key = val[2] ? new Date(val[0]).getTime() : val[0]
    this.props.handleSort(val[0],Number(val[1]))
  }


  render() {
    return (
      <Container fluid>
        <Form>
          <h4 className="title">Filters...</h4>
            <Form.Row>

              <TicketFilters filterTickets={this.props.filterTickets} />

            </Form.Row>

            <Form.Row>
              <Form.Label>Sort By: </Form.Label>
              <Form.Control
                as="select"
                defaultValue={'created_at|1|date'}
                onChange={e => this.sort(e.target.value)}
              >
                <option value='time_due|0|date'>Time Due Descending</option>
                <option value='time_due|1|date'>Time Due Ascending</option>
                <option value='time_ready|0|date'>Time Ready Descending</option>
                <option value='time_ready|1|date'>Time Ready Ascending</option>
                <option value='created_at|0|date'>Time Ordered Descending</option>
                <option value='created_at|1|date'>Time Ordered Ascending</option>
                <option value='id|0'>Ticket ID Descending</option>
                <option value='id|1'>Ticket ID Ascending</option>
              </Form.Control>
            </Form.Row>
          </Form>

      </Container>
    )
  }
}

export default FilterTicketsForm;
