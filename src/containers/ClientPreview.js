import React from 'react';
import { Modal, Button, Accordion, Row, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import NewClient from '../components/NewClient.js';

const ClientPreview = props => {

  const [showClientDetail, setShowClientDetail] = React.useState(false);
  const handleClose = () => setShowClientDetail(false);
  const handleShow = () => setShowClientDetail(true);

  const { client, handleEdit } = props;

  const toggleArchive = () => {
    const clientData = {...client};
    clientData.is_archived = !client.is_archived;
    handleEdit(clientData);
    handleClose();
  }

  return (
    <tr>
      <td>
        {
          client.is_archived
          ?
            <em>{client.name} (archived)</em>
          :
            <NavLink to={`/dispatch/clients/${client.id}`}>
              <strong>{client.name}</strong>
            </NavLink>
        }
      </td>
      <td>
        {client.address}
      </td>
      <td>
        {client.contact_phone}
      </td>
      <td>
        {client.contact_person}
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
          <Modal.Title>{client.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <NewClient
            client={client}
            handleEditClient={handleEdit}
            close={handleClose}
          />


        </Modal.Body>

        <Modal.Footer>

        <Accordion>
          <Row>
            <Accordion.Toggle eventKey={'confirmDelete'} as={Button}
             variant={'outline-danger'} id='deleteButton'>
              Delete Client
              </Accordion.Toggle>

            <Button
              variant={'outline-warning'}
              onClick={toggleArchive}
            >
              {
                props.client.is_archived
                ?
                  'Un-Archive Client'
                :
                  'Archive Client'
              }
            </Button>

            <Button
              variant={'outline-secondary'}
              onClick={handleClose}
            >
                Close
            </Button>

          </Row>
          <Row>
          <Accordion.Collapse eventKey={'confirmDelete'}>
            <Container fluid>
              <h4 className='title'>Are you sure?<br /> This can not be undone!</h4>
              <Button
                variant={'danger'}
                onClick={() => {
                  props.handleDelete(client.id);
                  handleClose();
                }}
              block >
                Confirm Delete
              </Button>
            </Container>
          </Accordion.Collapse>
          </Row>
          </Accordion>
        </Modal.Footer>
      </Modal>
    </tr>
  )
}

export default ClientPreview
