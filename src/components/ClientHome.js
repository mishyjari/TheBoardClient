import React from 'react';

class ClientHome extends React.Component {
  state = {
    clientId: this.props.match.params.id
  }

  render() {
    return (
      <h1>Client Home - Client ID #{this.state.clientId}</h1>
    )
  }
}

export default ClientHome
