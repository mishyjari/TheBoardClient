import React from 'react'
import { CLIENTS_API } from '../_helpers/Apis.js';
import { Container } from 'react-bootstrap';

class ClientShow extends React.Component {
  state = {
    client: {}
  }

  componentWillMount() {
    const id = this.props.match.params.id;
    fetch(CLIENTS_API + `/${id}`)
    .then( res => res.json() )
    .then( client => this.setState({ client }))
  }

  render() {
    return (
      <Container fluid>
        <h2>Client show page for {this.state.client.name}</h2>
      </Container>
    )
  }
}

export default ClientShow
