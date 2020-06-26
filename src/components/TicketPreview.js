import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Accordion, Button, Card, Table, Row, Col, Modal} from 'react-bootstrap';
import TicketDetail from './TicketDetail.js';
import NewTicket from './NewTicket.js';
import moment from 'moment';



const TicketPreview = props => {
  // For toggling delete confirmation modal
  const [show, setShow] = React.useState(false)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { client, clients, courier, couriers, pickup, dropoff, time_ready, time_due, id, created_at, is_complete  } = props.ticket;

  const toggleComplete = () => {
      const ticketData = {...props.ticket}
      ticketData.is_complete = !is_complete
      props.handleUpdate(ticketData)
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title
          as="h6"
        >
          #{id} | <strong>Ordered:</strong> {moment(created_at).format('ddd, MMM Do YYYY, LT ')} | {is_complete ? "COMPLETE" : "INCOMPLETE"}
        </Card.Title>
        <Card.Text>
          <Table bordered hover striped size='sm'>
            <tr>
              <th>Client</th>
              <th>Pickup Address</th>
              <th>Dropoff Address</th>
              <th>Time Due</th>
              <th>Time Ready</th>
              <th>Assigned Couirer</th>
              <th></th>
            </tr>
            <tbody>
              <tr>
                <td>
                  { client
                    ?
                      client.name
                    :
                      "Guest Account"
                  }
                </td>
                <td>{pickup}</td>
                <td>{dropoff}</td>
                <td>
                  {moment(time_due).format('ddd, MMM Do \'YY')}
                  <br />
                  {moment(time_due).format('LT')}
                </td>
                <td>
                  {moment(time_ready).format('dddd, MMM Do \'YY')}
                  <br />
                  {moment(time_ready).format('LT')}
                </td>
                <td>
                  { courier
                    ?
                      courier.first_name + " " + courier.last_name
                    :
                      "UNASSIGNED"
                  }
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Text>
        <Row>
          <Col>
            <Accordion.Toggle as={Button} variant="outline-info" eventKey={`ticketDetails-${id}`} block size="sm">
              Show Details
            </Accordion.Toggle>
          </Col>
        </Row>

      </Card.Header>
      <Accordion.Collapse
        eventKey={`ticketDetails-${props.ticket.id}`}
        id={`ticketDetails-${props.ticket.id}`}
        >
        <Card.Body>
          <TicketDetail
            {...props.ticket}
            handleUpdate={props.handleUpdate}
            handleDelete={props.handleDelete}
            ticket={props.ticket}
            clients={props.clients}
						couriers={props.couriers}
            handleNewTicket={props.handleUpdate}
          />
        </Card.Body>
      </Accordion.Collapse>
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
    </Card>
  )
}

export default TicketPreview
