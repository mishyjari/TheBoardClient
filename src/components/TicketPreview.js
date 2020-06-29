import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Accordion, Button, Card, Table, Row, Col, Modal, Dropdown, DropdownButton } from 'react-bootstrap';
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
      props.ticket.is_complete = !is_complete
      props.handleUpdate(props.ticket)
  }

  const assignTicket = courier_id => {
    props.ticket.courier_id = courier_id;
    props.handleUpdate(props.ticket)
  }

  const QuickAssign = () => {
    return (
      <div>
        {
          <DropdownButton
            id='assignToCourier'
            title='Unassigned'
            variant='outline-primary'
            size='lg'
          >
            <Dropdown.Header>Assign to Courier...</Dropdown.Header>
            {
              props.couriers.map(courier => <Dropdown.Item
                eventKey={courier.id}
                onClick={() => assignTicket(courier.id)}
              >
                {courier.full_name}
              </Dropdown.Item>)
            }
          </DropdownButton>
        }
      </div>
    )
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
                      <QuickAssign />
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
            toggleComplete={toggleComplete}
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
