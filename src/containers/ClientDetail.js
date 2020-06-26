import React from 'react';
import { Modal, Button, Table, Tooltip, OverlayTrigger } from 'react-bootstrap';

const ClientDetail = props => {
  {/* Modal Handlers */}
  const [showClientDetail, setShowClientDetail] = React.useState(false);
  const handleClose = () => setShowClientDetail(false);
  const handleShow = () => setShowClientDetail(true);

  return (
    <OverlayTrigger
      key={`clientDetail-${props.id}`}
      postion='left'
      delay='500'
      overlay={
          <Tooltip id='detailsTootip'>
              Click to view full client details
          </Tooltip>
      }>

    <tr onClick={handleShow}>
      <td>
        {props.name}
      </td>
      <td>
        {props.address}
      </td>

      {/* Modal displaying client information */}
      <Modal show={showClientDetail} onHide={handleClose}>

        <Modal.Header closeButton>
          <Modal.Title>Detailed Information for {props.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Table>
            <tbody>
              <tr>
                <td>Address</td>
                <td>{props.address}</td>
              </tr>
              <tr>
                <td>Contact Person</td>
                <td>{props.contact_person}</td>
              </tr>
              <tr>
                <td>Phone</td>
                <td>{props.contact_phone}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{props.email}</td>
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
          <Button
            variant={'outline-primary'}
            onClick={() => alert('Not Implemented')}
            block
          >
            View Invoices
          </Button>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant={'outline-dark'}
            onClick={() => alert('Npt Implemented')}
          >
            Edit Details
          </Button>
          <Button
            variant={'outline-warning'}
            onClick={() => alert('Npt Implemented')}
          >
            Archive Client
          </Button>
          <Button
            variant={'outline-secondary'}
            onClick={handleClose}
          >
              Close
          </Button>
        </Modal.Footer>
      </Modal>

    </tr>
    </OverlayTrigger>
  )
}

export default ClientDetail
