import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

const ClientPreview = props => {
  {/* Modal Handlers */}
  const [showClientDetail, setShowClientDetail] = React.useState(false);
  const handleClose = () => setShowClientDetail(false);
  const handleShow = () => setShowClientDetail(true);

  return (
    <tr>
      <td>
        {props.name}
      </td>
      <td>
        {props.address}
      </td>
      <td>
        {props.contact_phone}
      </td>
      <td>
        {props.contact_person}
      </td>

      <td>
        <Button
          variant={'outline-info'}
          onClick={handleShow}
          size='sm'
        >
          Edit
        </Button>
      </td>

      {/* Modal displaying client information */}
      <Modal show={showClientDetail} onHide={handleClose}>

        <Modal.Header closeButton>
          <Modal.Title>Detailed Information for {props.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h1>MEOW</h1>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant={'outline-dark'}
            onClick={() => alert('Not Implemented')}
          >
            Edit Details
          </Button>
          <Button
            variant={'outline-warning'}
            onClick={() => alert('Not Implemented')}
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
  )
}

export default ClientPreview
