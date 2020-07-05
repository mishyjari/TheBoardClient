import React from 'react';
import moment from 'moment';
import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom'

class ViewInvoice extends React.Component {

  state = {
    adjustment: this.props.invoice.adjustment
  }

  adjustment = e => {
    e.preventDefault();
    this.props.adjustment(this.props.invoice, this.state.adjustment)
  }

  render() {
    const { invoice } = this.props;
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
              invoice.tickets.map(t => <tr>
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
            <tr>
              <th>Adjustments</th>
                <td>{
                    invoice.adjustment && invoice.adjustment !== 0
                    ?
                      <strong>${invoice.adjustment}</strong>
                    :
                      <em>n/a</em>
                  }
                </td>
                <td>
                  <Form onChange={e => {
                      this.setState({ adjustment: e.target.value })
                    }}>
                    <Form.Control
                      type='number'
                      name='adjustment'
                      value={this.state.adjustment}
                    />
                  <Button type='submit' onClick={this.adjustment}>Commit</Button>
                  </Form>
                </td>
              </tr>
              <tr>
                <th>Total Balance:</th>
                  <td>
                    {
                      invoice.paid
                      ?
                        <strong className='text-success'>${invoice.balance}</strong>
                      :
                        <strong className='text-danger'>${invoice.balance}</strong>
                    }
                  </td>
            </tr>
          </tbody>
        </Table>
      </Container>
    )
  }
}

export default ViewInvoice
