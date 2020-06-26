import React from  'react';
import TicketPreview from './TicketPreview.js';
import { Accordion, Col, Row, Button, Form, Container, Tab } from 'react-bootstrap';
import FilterTicketsForm from './FilterTicketsForm.js'
import NewTicket from './NewTicket.js';

class TicketList extends React.Component {


	render() {
		return (
			<Container fluid>
				<Accordion>
				<Row>
					<Col>

							{/* New ticket toggle */}
							<Accordion.Toggle
								as={Button}
								variant={'outline-dark'}
								eventKey={'newTicket'}
								block
							>
								New Ticket
							</Accordion.Toggle>

							<Accordion.Collapse
								eventKey={'newTicket'}
								id={'ticketDetails-0'}
								>
								<NewTicket
									clients={this.props.clients}
									couriers={this.props.couriers}
									handleNewTicket={this.props.handleNewTicket}
								/>
							</Accordion.Collapse>
						</Col>

						<Col>
							{/* Filters Toggle */}
							<Accordion.Toggle
								as={Button}
								variant='outline-dark'
								eventKey={'filtersForm'}
								block
							>
								Filters
							</Accordion.Toggle>

							<Accordion.Collapse eventKey={'filtersForm'}>
								<FilterTicketsForm
									handleSort={this.props.handleSort}/>
							</Accordion.Collapse>
						</Col>
					</Row>

					<Row>
						<Col>
							{/* Render tickets from props */}
							{this.props.tickets.map(ticket => <TicketPreview
								ticket={ticket}
								clients={this.props.clients}
								couriers={this.props.couriers}
								handleUpdate={this.props.handleUpdate}
								handleDelete={this.props.handleDelete}
								selectTicket={this.props.selectTicket}
								/>)}
						</Col>
					</Row>
				</Accordion>
			</Container>
		)
	}
}

export default TicketList;
