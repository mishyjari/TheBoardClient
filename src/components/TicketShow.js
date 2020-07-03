import React from 'react';
import TicketPreview from './TicketPreview.js';
import { TICKETS_API } from '../_helpers/Apis.js';

import { Container } from 'react-bootstrap'

class TicketShow extends React.Component {

  state = {
    ticket: {}
  }

  componentWillMount() {
    const id = this.props.match.params.id
    fetch(TICKETS_API + `/${id}`)
    .then( res => res.json() )
    .then( ticket => this.setState({ ticket }))
  }

  render() {
    console.log(this.state)
    return (
      <Container fluid>
        <TicketPreview
          ticket={this.state.ticket}
          clients={this.props.clients}
          couriers={this.props.couriers}
          handleUpdate={this.props.handleUpdate}
          handleDelete={this.props.handleDelete}
        />
      </Container>
    )
  }
}
export default TicketShow;
