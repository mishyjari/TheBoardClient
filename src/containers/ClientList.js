import React from 'react';
import ClientPreview from './ClientPreview.js';
import { Table, Accordion } from 'react-bootstrap';

const ClientList = props => {
  return (

    <Table hover striped>
      <tr>
        <th>Name</th>
        <th>Address</th>
        <th>Phone</th>
        <th>Contact Person</th>
        <th></th>
      </tr>
      <tbody>
      {
        props.clients.map(client => <ClientPreview {...client} />)
      }
      </tbody>
    </Table>
  )
}

export default ClientList
