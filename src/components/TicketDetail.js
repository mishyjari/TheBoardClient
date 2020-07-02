import React from 'react';
import moment from 'moment'
import { Table, Modal, Button, Container, Accordion, Row, Col, Card, useAccordionToggle } from 'react-bootstrap';
import NewTicket from './NewTicket.js';
import PodCard from './PodCard.js';

const TicketDetail = props => {
  // For toggling delete confirmation modal
  //const { client, clients, courier, couriers, pickup, dropoff, time_ready, time_due, id, created_at, is_complete  } = props.ticket;
  const [show, setShow] = React.useState(false)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { base_charge, client, pod, time_delivered, clients, courier, couriers, pickup, dropoff, time_ready, time_due, id, created_at, is_complete  } = props


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
          {
            is_complete
            ?
              <Button
                variant='outline-dark'
                block
                size='sm'
                onClick={props.toggleComplete}
              >
                Mark Incomplete
              </Button>
            :
              <Accordion.Toggle
                eventKey={'promptForPod'}
                block
                as={Button}
                variant={'outline-success'}
                size='sm'
              >
                Mark Complete
              </Accordion.Toggle>
          }
          <Accordion.Collapse eventKey={'promptForPod'} id={'promptForPod'}>
            <PodCard ticket={props.ticket} handleComplete={props.handleUpdate} />
          </Accordion.Collapse>
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
      <Row>
        <Col>
          <Table striped hover>
            <tbody>
              <tr>
                <th>Ordered</th>
                <td>{moment(created_at).format("L, LT")}</td>
              </tr>
              <tr>
                <th>Ready</th>
                <td>{moment(time_ready).format("L, LT")}</td>
              </tr>
              <tr>
                <th>Due</th>
                <td>{moment(time_due).format("L, LT")}</td>
              </tr>
              <tr>
                <th>Delivered</th>
                <td>
                  {
                    time_delivered
                    ?
                      moment(created_at).format("L, LT")
                    :
                      null
                  }
                </td>
              </tr>
              <tr>
                <th>Courier</th>
                <td>
                  {
                    courier
                    ?
                      <em>{courier.first_name} {courier.last_name}</em>
                    :
                      'Unassigned'
                  }
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col>
          <Table striped hover>
            <tbody>
              <tr>
                <th>Client</th>
                <td>{
                    client
                    ?
                      client.name
                    :
                      null
                  }</td>
              </tr>
              <tr>
                <th>Pickup</th>
                <td>{pickup}</td>
              </tr>
              <tr>
                <th>Dropoff</th>
                <td>{dropoff}</td>
              </tr>
              <tr>
                <th>Recieved By</th>
                <td>
                  {
                    pod
                    ?
                      pod
                    :
                      null
                  }
                </td>
              </tr>
              <tr>
                <th>Charge</th>
                <td>${base_charge}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>

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
