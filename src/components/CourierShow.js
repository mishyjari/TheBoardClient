import React from 'react';
import { COURIERS_API } from '../_helpers/Apis.js';
import { Container } from 'react-bootstrap';

class CourierShow extends React.Component {
  state = {
    courier: {}
  }

  componentWillMount() {
    const id = this.props.match.params.id
    fetch(COURIERS_API + `/${id}`)
    .then( res => res.json() )
    .then( courier => this.setState({ courier }) )
  }

  render() {
    return (
      <Container fluid>
        <h3>Courier show page for {this.state.courier.full_name}</h3>
      </Container>
    )
  }
}

export default CourierShow;
