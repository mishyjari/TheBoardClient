import React from 'react';

class CourierHome extends React.Component {
  state = {
    courierId: this.props.match.params.id
  }

  render() {
    return (
      <h1>Courier Home - Courier ID #{this.state.courierId}</h1>
    )
  }
}

export default CourierHome
