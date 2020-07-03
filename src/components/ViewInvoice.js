import React from 'react';
import moment from 'moment';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { NavLink } from 'react-router-dom'

const ViewInvoice = props => {
  return (
    <Container fluid>
      <Table striped hover>
        <tr>
          <th>ID</th>
          <th>Date ordered</th>
          <th>Pickup</th>
          <th>Dropoff</th>
          <th>Time Ready</th>
          <th>Time Due</th>
          <th>Recieved By</th>
          <th>Time Delivered</th>
          <th>Base Charge</th>
        </tr>
        <tbody>
          {
            props.invoice.tickets.map(t => <tr>
              <td><NavLink to={`/dispatch/tickets/${t.id}`}>
              #{t.id}
              </NavLink></td>
              <td>{moment(t.created_at).format('L')}</td>
              <td>{t.pickup}</td>
              <td>{t.dropoff}</td>
              <td>{moment(t.time_ready).format('L, LT')}</td>
              <td>{moment(t.time_due).format('L, LT')}</td>
              <td>{t.pod}</td>
              <td>{moment(t.time_delivered).format('L, LT')}</td>
              <td>{t.base_charge}</td>
            </tr>)
          }
        </tbody>
      </Table>
    </Container>
  )
}

export default ViewInvoice
