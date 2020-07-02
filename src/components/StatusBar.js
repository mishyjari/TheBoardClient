import React from 'react';
import { Accordion, Button, Link, Dropdown, Modal, Table, Container, Row, Col, Badge } from 'react-bootstrap';
import { BrowserRouter as Router, NavLink } from 'react-router-dom';
import CourierDetail from "../containers/CourierDetail.js"

const StatusBar = props => {

	let selectedCourier = {}

	const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

	return (
		<Container fluid className='status-bar'>
			<Col>
				<Accordion defaultActiveKey={'toggleCouriers'}>
					<Row>
						<Accordion.Toggle
							as={'h4'}
							className='hover-pointer title'
							variant={'outline-secondary'}
							size='sm'
							eventKey={'toggleCouriers'}
							block
							>
							Active Couriers &#8628;
						</Accordion.Toggle>
						<Accordion.Collapse eventKey={'toggleCouriers'}>
							<Table hover striped>
								<tr className='text-center'>
									<th>Name</th>
									<th>Incomplete Tickets</th>
									<th>Tickets Today</th>
								</tr>
								<tbody>
							{
								props.couriers.filter(courier => courier.is_active)
								.sort((a,b) => b.incomplete_tickets.length - a.incomplete_tickets.length)
								.map(courier => {

									return <tr className='text-center'>
										<td><strong>{courier.full_name}</strong></td>
										<td><NavLink

											to='/dispatch/tickets'
											size='lg'
											variant='outline-info'
											onClick={() => props.incompleteCourierTickets(courier.id)}
										>

											<Badge pill variant='warning' size='lg'> {courier.incomplete_tickets.length}</Badge>

										</NavLink></td>

										<td><NavLink
											to='/dispatch/tickets'
											size='lg'
											variant='outline-info'
											onClick={() => props.courierTicketsToday(courier.id)}
										>

											<Badge pill variant='success' size='lg'> {courier.tickets_today.length}</Badge>

										</NavLink></td>
									</tr>
									}
								)
							}
							</tbody>
						</Table>
						</Accordion.Collapse>
					</Row>
					<Row>
						<Accordion.Toggle
							as={'h4'}
							className='hover-pointer title'
							variant={'outline-secondary'}
							size='sm'
							eventKey={'toggleClients'}
							block
							>
							Clients With Incomplete Tickets &#8628;
						</Accordion.Toggle>
						<Accordion.Collapse eventKey={'toggleClients'}>
							<Table hover striped>
								<tr className='text-center'>
									<th>Name</th>
									<th>Incomplete Tickets</th>
									<th>Tickets Today</th>
								</tr>
								<tbody>
							{
								props.clients.filter(client => client.incomplete_tickets.length > 0)
								.sort((a,b) => b.incomplete_tickets.length - a.incomplete_tickets.length)
								.map(client => {
									return <tr className='text-center'>
										<td><strong>{client.name}</strong></td>
										<td><NavLink
											to='/dispatch/tickets'
											onClick={() => props.clientTickets(client.id)}
										>
											<Badge pill variant='warning' size='lg'> {client.incomplete_tickets.length}</Badge>
										</NavLink></td>
										<td><NavLink
											to='/dispatch/tickets'
											onClick={() => props.clientTickets(client.id)}
										>
											<Badge pill variant='success' size='lg'> {client.incomplete_tickets.length}</Badge>
										</NavLink></td>
									</tr>
									}
								)
							}
							</tbody>
						</Table>
						</Accordion.Collapse>
					</Row>
				</Accordion>
			</Col>
		</Container>
	)
}

export default StatusBar
