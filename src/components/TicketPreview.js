import React from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import { Accordion, Button, Card, Table, Row, Col, Modal, Dropdown, DropdownButton } from 'react-bootstrap';
import TicketDetail from './TicketDetail.js';
import NewTicket from './NewTicket.js';
import moment from 'moment';



const TicketPreview = props => {
  // For toggling delete confirmation modal
  const [show, setShow] = React.useState(false)
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { client, client_id, courier, pod, courier_id, pickup, dropoff, time_ready, time_due, id, created_at, is_complete, time_delivered } = props.ticket;
  const { clients, couriers } = props;

  const toggleComplete = () => {
      props.ticket.is_complete = !is_complete
      props.handleUpdate(props.ticket)
  }

  const assignTicket = courier_id => {
    props.ticket.courier_id = courier_id;
    props.handleUpdate(props.ticket)
  }

  const borderStyle = () => {
    if ( is_complete && !pod ) { return 'warning' }
    else if ( is_complete ) { return 'success' }
    else if ( !courier_id ) { return 'primary' }
    else { return 'warning' }
  }

  const QuickAssign = () => {
    return (
      <div>
        {
          couriers.find(c => c.id == courier_id)
          ?
            <NavLink to={`/dispatch/couriers/${courier_id}`}>
              <strong>
                {couriers.find(c => c.id == courier_id).full_name}
              </strong>
            </NavLink>
          :
            <DropdownButton
              id='assignToCourier'
              title='Unassigned'
              variant='outline-primary'
              size='sm'
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
    <Card border={borderStyle()} className='ticketPreview' >
      <Card.Header>
        <Card.Title
          as="h6"
        >
          <NavLink to={`/dispatch/tickets/${id}`}>
          #{id}
          </NavLink>
          <strong> | Ordered: </strong>
          {moment(created_at).format('ddd, MMM Do YYYY, LT ')}
        </Card.Title>
        <Card.Text>
          <Table bordered hover striped size='sm' className='text-center'>
            <tr>
              <th>Client</th>
              <th>Pickup Address</th>
              <th>Dropoff Address</th>
              <th>Time Due</th>
              <th>Time Ready</th>
              <th>Status</th>
              <th>Assigned Couirer</th>
              <th></th>
            </tr>
            <tbody>
              <tr>
                <td>
                  <strong>{
                      clients.find(c => c.id == client_id)
                    ?
                      <NavLink to={`/dispatch/clients/${client_id}`}>
                        {clients.find(c => c.id == client_id).name}
                      </NavLink>
                    :
                      "Guest Account"
                  }</strong>
                </td>
                <td>{pickup}</td>
                <td>{dropoff}</td>
                <td>
                  {moment(time_due).format('L')}
                  <br />
                  {moment(time_due).format('LT')}
                </td>
                <td>
                  {moment(time_ready).format('L')}
                  <br />
                  {moment(time_ready).format('LT')}
                </td>
                  {
                    is_complete
                    ?
                      <td>
                        <em className='alert-success'> COMPLETE</em><br />
                          {
                            pod ? (<em><strong>Recieved By: </strong>{pod}</em>) : null
                          }
                        {
                          time_delivered ? <p>{moment(time_delivered).format("L, LT")}</p> : null
                        }
                      </td>
                    :
                      <td>
                        <strong className='alert-warning'> INCOMPLETE</strong>
                      </td>

                  }
                <td>
                  <QuickAssign />
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
