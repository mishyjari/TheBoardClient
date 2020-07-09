import React from 'react';
import { Accordion, Table, Container, Row, Col, Badge } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const StatusBar = props => {

	return (
		<Container fluid id='status-bar'>
			<Col>
				<Accordion defaultActiveKey={'toggleCouriers'}>
					<Row>
						<Accordion.Toggle
							as={'h4'}
							className='hover-pointer title'
							variant={'outline-secondary'}
							size='sm'
							eventKey={'toggleCouriers'}
							>
							Active Couriers &#8628;
						</Accordion.Toggle>
						<Accordion.Collapse eventKey={'toggleCouriers'}>
							<Table hover striped>
								<thead>
									<tr className='text-center'>
											<th>Name</th>
											<th>Incomplete Tickets</th>
											<th>Tickets Today</th>
									</tr>
								</thead>
								<tbody>
							{
								props.couriers.filter(courier => courier.is_active)
								.sort((a,b) => b.incomplete_tickets.length - a.incomplete_tickets.length)
								.map(courier => {

									return <tr className='text-center' key={courier.id}>
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

											<Badge pill variant='info' size='lg'> {courier.tickets_today.length}</Badge>

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
					<Accordion defaultActiveKey='toggleClients'>
					<Row>
						<Accordion.Toggle
							as={'h4'}
							className='hover-pointer title'
							variant={'outline-secondary'}
							size='sm'
							eventKey={'toggleClients'}
							>
							Clients With Incomplete Tickets &#8628;
						</Accordion.Toggle>
						<Accordion.Collapse eventKey={'toggleClients'}>
							<Table hover striped>
								<thead>
									<tr className='text-center'>
										<th>Name</th>
										<th>Incomplete Tickets</th>
										<th>Tickets Today</th>
									</tr>
								</thead>
								<tbody>
							{
								props.clients.filter(client => client.incomplete_tickets.length > 0)
								.sort((a,b) => b.incomplete_tickets.length - a.incomplete_tickets.length)
								.map(client => {
									return <tr className='text-center' key={client.id}>
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
											<Badge pill variant='info' size='lg'> {client.incomplete_tickets.length}</Badge>
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
