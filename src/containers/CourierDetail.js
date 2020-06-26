import React from 'react';
import { Table, Button, Container } from 'react-bootstrap';

const CourierDetail = props => {
  return (
    <Container fluid>
      <Table>
        <tbody>
          <tr>
            <td>name</td>
            <td>{props.courier.full_name}</td>
          </tr>
          <tr>
            <td>Phone</td>
            <td>{props.courier.phone}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{props.courier.email}</td>
          </tr>
          <tr>
            <td>Radio</td>
            <td>{props.courier.radio_number}</td>
          </tr>
        </tbody>
      </Table>

      <Button
        variant={'outline-info'}
        onClick={() => alert('Not Implemented')}
        block
      >
        View Tickets
      </Button>
    </Container>
  )
}

export default CourierDetail;
