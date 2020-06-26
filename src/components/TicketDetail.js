import React from 'react';
import { Modal, Button, Container, Accordion, Row, Col, Card } from 'react-bootstrap';
import NewTicket from './NewTicket.js';

const TicketDetail = props => {
  // For toggling delete confirmation modal
  //const { client, clients, courier, couriers, pickup, dropoff, time_ready, time_due, id, created_at, is_complete  } = props.ticket;
  const [show, setShow] = React.useState(false)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { client, clients, courier, couriers, pickup, dropoff, time_ready, time_due, id, created_at, is_complete  } = props

  const toggleComplete = () => {
      const ticketData = {...props};
      ticketData.is_complete = !is_complete;
      props.handleUpdate(ticketData);
  }

  return (
    <Accordion>
      {/* Buttons */}
      <Row>
        <Col>
          <Accordion.Toggle as={Button} variant="outline-secondary" eventKey={`editTicket-${id}`} block size="sm">
            Edit Ticket
          </Accordion.Toggle>
        </Col>
        <Col>
          <Button
            variant='outline-success'
            block
            size='sm'
            onClick={toggleComplete}
          >
            {
              is_complete
              ?
                "Mark Incomplete"
              :
                "Mark Complete"
            }
          </Button>
        </Col>
        <Col>
          <Button
            variant='outline-danger'
            block
            size='sm'
            onClick={handleShow}
          >
            Delete Ticket
          </Button>
          <Modal
            show={show}
            onHide={handleClose}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Confirm Delete
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Really delete ticket #{props.id}? This can not be undone!
            </Modal.Body>
            <Modal.Footer>
              <Button variant='primary' onClick={handleClose}>
                Cancel
              </Button>
              <Button variant='danger' onClick={() => {
                  props.handleDelete(props.id)
                  handleClose()
                }
              }>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>

      </Row>

      <ul>
        <li>{
            props.courier_id
            ?
              "Assigned to courier id " + props.courier_id
            :
              "Unassigned"
          }</li>
        <li><strong>Client: </strong>{
          props.client_id
          ?
            "Client ID - " + props.client_id
          :
            "Guest Account"
        }</li>
      <li><strong>Ordered: </strong>{new Date(props.created_at).toLocaleString()}</li>
      <li><strong>Ready: </strong>{new Date(props.time_ready).toLocaleString()}</li>
      <li><strong>Due: </strong>{new Date(props.time_due).toLocaleString()}</li>
      </ul>
      <Accordion.Collapse eventKey={`editTicket-${id}`}>
        <Card.Body>
          <NewTicket
            ticket={props.ticket}
            clients={props.clients}
            couriers={props.couriers}
            handleNewTicket={props.handleUpdate}
            />
        </Card.Body>
      </Accordion.Collapse>

    </Accordion>
  )
}

export default TicketDetail
