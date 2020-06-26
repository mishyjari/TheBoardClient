import React from 'react';
import { Accordion, Button, Link, Dropdown, Modal } from 'react-bootstrap';
import { BrowserRouter as Router, NavLink } from 'react-router-dom';
import CourierDetail from "../containers/CourierDetail.js"

const StatusBar = props => {

	let selectedCourier = {}

	const [show, setShow] = React.useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

	return (
		<div id="status-bar">
			<h3 className='title'>StatusBar</h3>
			<Accordion defaultActiveKey={'toggleCouriers'}>
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
					<ul>
					{
						props.couriers.filter(courier => courier.is_active)
						.sort((a,b) => b.tickets.length - a.tickets.length)
						.map(courier => {



							return <li className='hover-pointer' onClick={handleShow}>{courier.full_name}</li>
							}
						)
					}
					</ul>
				</Accordion.Collapse>
				<h4>Active Clients</h4>
					<ul>
					{
						props.clients.map(client => (
							<li>
								<Accordion.Toggle as={Button} variant={'link'} eventKey={`client${client.id}`}>
									{client.name} ({client.tickets.length})
								</Accordion.Toggle>
								<Accordion.Collapse eventKey={`client${client.id}`}>
									<ul>
										{
											client.tickets.map(ticket => <li>Ticket #{ticket.id}</li>)
										}
									</ul>
								</Accordion.Collapse>
							</li>))
					}
					</ul>
			</Accordion>

				{/* Modal displaying Courier information */}

				<Modal show={show} onHide={handleClose} size="lg">

					<Modal.Header closeButton>
						<Modal.Title>Detailed Information</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						<h3>Courier Info {selectedCourier.name || 'meow'}</h3>
					</Modal.Body>

					<Modal.Footer>
						<Button
							variant={'outline-warning'}
							onClick={() => alert('Not Implemented')}
						>
							Archive Courier
						</Button>
						<Button
							variant={'outline-secondary'}
							onClick={handleClose}
						>
								Close
						</Button>
					</Modal.Footer>
				</Modal>




		</div>
	)
}

export default StatusBar
