import React from 'react';
import { NavLink } from 'react-router-dom';
import { Accordion, Button, Card, Table, Row, Col, Dropdown, DropdownButton } from 'react-bootstrap';
import TicketDetail from './TicketDetail.js';
import NewTicket from './NewTicket.js';
import moment from 'moment';



const TicketPreview = props => {

  const { client_id, pod, courier_id, pickup, dropoff, time_ready, time_due, id, created_at, is_complete, time_delivered, is_rush, is_oversize, is_roundtrip } = props.ticket;
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
    else if ( (moment(time_due) < moment()) && !is_complete ) { return 'danger' }
    else if ( is_complete ) { return 'success' }
    else if ( !courier_id ) { return 'info' }
    else { return 'dark' }
  }

  const QuickAssign = () => {
    return (
      <div>
        {
          couriers.find(c => c.id === Number(courier_id))
          ?
            <NavLink to={`/dispatch/couriers/${courier_id}`}>
              <strong>
                {couriers.find(c => c.id === Number(courier_id)).full_name}
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
                  key={courier.id}
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
        <Card.Text as={'div'}>
          <Table bordered hover striped size='sm' className='text-center'>
            <thead>
              <tr>
                <th>Client</th>
                <th>Pickup Address</th>
                <th>Dropoff Address</th>
                <th>Time Ready</th>
                <th>Time Due</th>
                <th>Modifiers</th>
                <th>Status</th>
                <th>Assigned Couirer</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>{
                      clients.find(c => c.id === Number(client_id))
                    ?
                      <NavLink to={`/dispatch/clients/${client_id}`}>
                        {clients.find(c => c.id === Number(client_id)).name}
                      </NavLink>
                    :
                      "Guest Account"
                  }</strong>
                </td>
                <td>{pickup}</td>
                <td>{dropoff}</td>
                <td>
                  {moment(time_ready).format('L')}
                  <br />
                  {moment(time_ready).format('LT')}
                </td>
                {
                  ( (moment(time_due) < moment()) && !is_complete )
                  ?
                    <td className='alert-danger'>
                      <strong>
                        {moment(time_due).format('L')}
                        <br />
                        {moment(time_due).format('LT')}
                        <br />
                        LATE
                      </strong>
                    </td>
                    :
                      <td>
                          {moment(time_due).format('L')}
                          <br />
                          {moment(time_due).format('LT')}
                      </td>
                }

                <td>
                  {is_rush ? <strong className='text-danger'>RUSH!!<br /></strong> : null}
                  {is_oversize ? <em className='text-info'>Oversize<br /></em> : null}
                  {is_roundtrip ? <em className='text-primary'>Roundtrip<br /></em> : null}
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
            <Accordion.Toggle
              as={Button}
              variant="outline-info"
               eventKey={`ticketDetails-${id}`}
               block
               size="sm"
               id={`ticketDetails-${id}-toggle`}
               onClick={props.toggleActiveMenus}
               active={props.activeMenus.includes(`ticketDetails-${id}`)}>
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
            activeMenus={props.activeMenus}
            toggleActiveMenus={props.toggleActiveMenus}
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
