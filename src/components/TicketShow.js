import React from 'react';
import TicketPreview from './TicketPreview.js';
import { TICKETS_API } from '../_helpers/Apis.js';

import { Container, Accordion } from 'react-bootstrap'

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

  handleDelete = id => {
    this.props.handleDelete(id);
    this.props.history.push('/dispatch/tickets')
  }

  handleUpdate = ticket => {
    this.setState({ticket}, this.props.handleUpdate(ticket))
  }

  render() {
    return (
      <Container fluid>
        <Accordion>
          <TicketPreview
            ticket={this.state.ticket}
            clients={this.props.clients}
            couriers={this.props.couriers}
            handleUpdate={this.handleUpdate}
            handleDelete={this.handleDelete}
            toggleActiveMenus={() => console.log('open sesame')}
            activeMenus={[]}
          />
        </Accordion>
      </Container>
    )
  }
}
export default TicketShow;
