import React from 'react';
import { Modal, Button, Table, Tooltip, Accordion, Row, Container, Col } from 'react-bootstrap';
import CourierDetail from "./CourierDetail.js";
import NewCourier from "../components/NewCourier.js";

const CourierPreview = props => {
  {/* Modal Handlers */}
  const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { id, full_name, phone, email, is_active, radio_number, tickets } = props.courier

  const incompleteTickets = () => {
    return tickets.filter(ticket => !ticket.is_complete)
  }

  const toggleArchive = () => {
    props.courier.is_archived = !props.courier.is_archived
    props.updateCourier(props.courier)
  }


  return (

    <tr>
      <td>
        {full_name}
      </td>
      <td>
        {phone}
      </td>
      <td>
        {email}
      </td>
      <td>
        {radio_number}
      </td>
      <td>
        {incompleteTickets().length}
      </td>

      <td>
        {
          !is_active
          ?
            <Button
              variant={'secondary'}
              onClick={() => props.toggleActive(props.courier)}
              size="sm">
              X
            </Button>
          :
            <Button
              variant={'success'}
              onClick={() => props.toggleActive(props.courier)}
              size="sm"
              >
              √
            </Button>
        }
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

      {/* Modal displaying Courier information */}
      <Modal show={show} onHide={handleClose} size="xl">

        <Modal.Header closeButton>
          <Modal.Title>Detailed Information for {full_name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <NewCourier
            courier={props.courier}
            handleSubmit={props.updateCourier}
            handleClose={handleClose}
            />

        </Modal.Body>

        <Modal.Footer>

        <Accordion>
          <Row>
            <Accordion.Toggle eventKey={'confirmDelete'} as={Button}
             variant={'outline-danger'} id='deleteButton'>
              Delete Courier
              </Accordion.Toggle>

            <Button
              variant={'outline-warning'}
              onClick={toggleArchive}
            >
              { props.courier.is_archived
                ?
                  'Un-Archive Courier'
                :
                  'Archive Courier'
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
                  props.deleteCourier(props.courier.id);
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

export default CourierPreview
