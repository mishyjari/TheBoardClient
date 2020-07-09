import React from 'react';
import moment from 'moment'
import { Form, Table, Modal, Button, Container, Accordion, Row, Col, Card, useAccordionToggle } from 'react-bootstrap';
import NewTicket from './NewTicket.js';
import TicketEdit from './TicketEdit.js';
import PodCard from './PodCard.js';

const TicketDetail = props => {
  // For toggling delete confirmation modal
  //const { client, clients, courier, couriers, pickup, dropoff, time_ready, time_due, id, created_at, is_complete  } = props.ticket;
  const [show, setShow] = React.useState(false)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showEdit, setShowEdit] = React.useState(false)

  const { base_charge, client, pod, time_delivered, clients, courier, couriers, pickup, dropoff, time_ready, time_due, id, created_at, is_complete  } = props


  return (

    <Accordion>
      {/* Buttons */}
      <Row>
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
                className='form-toggle-btn'
                size='sm'
                id={`toggleComplete-${id}`}
                onClick={props.toggleActiveMenus}
                active={props.activeMenus.includes(`toggleComplete-${id}`)}
              >
                Mark Complete
              </Accordion.Toggle>
          }

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
        <Accordion.Collapse
          style={{position: 'absolute', zIndex: '100', width: '50%'}}
          eventKey={'promptForPod'} id={'promptForPod'}>
          <PodCard ticket={props.ticket} handleComplete={props.handleUpdate} />
        </Accordion.Collapse>
      </Row>
      <Row>
        <Form.Check
          type='switch'
          id={`showEditSwitch-${id}`}
          checked={showEdit}
          onChange={() => setShowEdit(!showEdit)}
          label='Edit Ticket'
          />
      </Row>

      { showEdit
      ?

        <TicketEdit
          ticket={props.ticket}
          clients={props.clients}
          couriers={props.couriers}
          handleUpdate={props.handleUpdate}
          closeForm={() => setShowEdit(!showEdit)}
        />

      :
        <Container>
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
                    <th>Rush?</th>
                    <td>{props.ticket.is_rush ? 'Yes' : 'No' }</td>
                  </tr>
                  {
                    props.ticket.is_rush
                    ?
                      <tr>
                        <th>Rush Details</th>
                        <td>{props.ticket.rush_details}</td>
                      </tr>
                    :
                      null
                  }
                  <tr>
                    <th>Delivered</th>
                    <td>
                      {
                        time_delivered
                        ?
                          moment(created_at).format("L, LT")
                        :
                          'No'
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
                  <tr>
                    <th>Oversize?</th>
                    <td>{props.ticket.is_oversize ? 'Yes' : 'No' }</td>
                  </tr>
                  {
                    props.ticket.is_oversize
                    ?
                      <tr>
                        <th>Oversize Details</th>
                        <td>{props.ticket.oversize_details}</td>
                      </tr>
                    :
                      null
                  }
                  <tr>
                    <th>Roundtrip?</th>
                    <td>{props.ticket.is_roundtrip ? 'Yes' : 'No' }</td>
                  </tr>
                  {
                    props.ticket.id_roundtrip
                    ?
                      <tr>
                        <th>Roundtrip Details</th>
                        <td>{props.ticket.roundtrip_details}</td>
                      </tr>
                    :
                      null
                  }
                </tbody>
              </Table>
              <h6>Notes:</h6>
              <p>{props.ticket.notes}</p>
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
                    <th>Pickup Address</th>
                    <td>{pickup}</td>
                  </tr>
                  <tr>
                    <th>Pickup Contact</th>
                    <td>{props.ticket.pickup_contact}</td>
                  </tr>
                  <tr>
                    <th>Pickup Details</th>
                    <td>{props.ticket.pickup_details}</td>
                  </tr>
                  <tr>
                    <th>Dropoff</th>
                    <td>{dropoff}</td>
                  </tr>
                  <tr>
                    <th>Dropoff Contact</th>
                    <td>{props.ticket.dropoff_contact}</td>
                  </tr>
                  <tr>
                    <th>Dropoff Details</th>
                    <td>{props.ticket.dropoff_details}</td>
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
                </tbody>
              </Table>

              <Table>
                <tbody>
                  <tr>
                    <th>Base Charge</th>
                    <th>Additional Charge</th>
                    {
                      props.ticket.is_rush
                      ?
                        <th>Rush Charge</th>
                      :
                        null
                    }
                    {
                      props.ticket.is_roundtrip
                      ?
                        <th>Roundtrip Charge</th>
                      :
                        null
                    }
                    {
                      props.ticket.is_oversize
                      ?
                        <th>Oversize Charge</th>
                      :
                        null
                    }
                    <th>Total Charge</th>
                  </tr>
                  <tr>
                    <td>${props.ticket.base_charge}</td>
                    <td>${props.ticket.additional_charge}</td>
                    {
                      props.ticket.is_rush
                      ?
                        <td>${props.ticket.rush_charge}</td>
                      :
                        null
                    }
                    {
                      props.ticket.is_roundtrip
                      ?
                        <td>${props.ticket.roundtrip_charge}</td>
                      :
                        null
                    }
                    {
                      props.ticket.is_oversize
                      ?
                        <td>${props.ticket.oversize_charge}</td>
                      :
                        null
                    }
                    <td>${props.ticket.total_charge}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      }
    </Accordion>
  )
}

export default TicketDetail
