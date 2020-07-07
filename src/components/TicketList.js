import React from  'react';
import TicketPreview from './TicketPreview.js';
import { Accordion, Col, Row, Button, Form, Container, Tab } from 'react-bootstrap';
import { NavLink, Route } from 'react-router-dom'
import FilterTicketsForm from './FilterTicketsForm.js'
import NewTicket from './NewTicket.js';
import SearchForm from './SearchForm.js';
import TicketShow from './TicketShow.js';
import { TICKETS_API } from '../_helpers/Apis.js';
import Pagination from 'react-js-pagination';


class TicketList extends React.Component {

	state = {
		totalResults: 0,
		activeMenus: []
	}

	toggleActiveMenus = e => {
		const id = e.target.id;
		const activeMenus = [...this.state.activeMenus];
		activeMenus.includes(id)
		?
			activeMenus.splice(activeMenus.indexOf(id), 1)
		:
			activeMenus.push(id)
		this.setState({ activeMenus})
	}

	componentDidRecieveProps() {
		this.setState({ totalResults: this.props.ticketSearchResultCount })
	}

	render() {
		return (
			<Container fluid className='list-main'>
				<Route exact path='/dispatch/tickets/:id' render={routerProps => <TicketShow
						{...routerProps}
						clients={this.props.clients}
						couriers={this.props.couriers}
						handleUpdate={this.props.handleUpdate}
						handleDelete={this.props.handleDelete}/>} />

				<Route exact path='/dispatch/tickets'>

						<Row>
							<h4 className='sub-sub-heading'>Displaying {this.props.ticketFilterTitle}</h4>
						</Row>
						<Row>
							<Col></Col>
							{ this.props.ticketSearchResultCount
							?
								<Col>
									<NavLink to='/dispatch/tickets' onClick={this.props.reset}>
										<Button block variant='outline-primary' size='sm'>Reset</Button>
									</NavLink>
									<Pagination
										activePage={this.props.activePage}
										itemClass="page-item"
										linkClass="page-link"
										itemsCountPerPage={20}
										totalItemsCount={this.props.ticketSearchResultCount}
										pageRangeDisplayed={5}
										onChange={this.props.handlePageChange.bind(this)}
										/>
									</Col>
								: null
							}<Col></Col>
						</Row>

					<Row id='tickets-menu-container'>
						<Col>
							<Accordion>
								{/* New ticket toggle */}
								<Accordion.Toggle
									as={Button}
									variant={'outline-dark'}
									eventKey={'newTicket'}
									id={'new-ticket-btn'}
									className='form-toggle-btn'
									onClick={this.toggleActiveMenus}
				          active={this.state.activeMenus.includes('new-ticket-btn')}
									block
								>
									New Ticket
								</Accordion.Toggle>

								<Accordion.Collapse
									eventKey={'newTicket'}
									id={'new-ticket-accordion'}
									>
									<NewTicket
										clients={this.props.clients}
										couriers={this.props.couriers}
										handleNewTicket={this.props.handleNewTicket}
									/>
								</Accordion.Collapse>
								</Accordion>
							</Col>

							<Col>

							<Accordion>
								{/* Filters Toggle */}
								<Accordion.Toggle

									as={Button}
									variant='outline-dark'
									eventKey={'searchToggle'}
									id={'search-toggle-btn'}
									className='form-toggle-btn'
									onClick={this.toggleActiveMenus}
				          active={this.state.activeMenus.includes('search-toggle-btn')}
									block
								>
									Filters and Search
								</Accordion.Toggle>

								<Accordion.Collapse
									className='dropdown-inner'
									eventKey={'searchToggle'}
									id={'searchToggle'}
								>
									<Col md={8}>
									<FilterTicketsForm
										handleSort={this.props.handleSort}
										filterTickets={this.props.filterTickets}
										/>
									<SearchForm
										tickets={this.props.searchRes}
										couriers={this.props.couriers}
										clients={this.props.clients}
										couriers={this.props.couriers}
										search={this.props.search}
									/>
									</Col>
								</Accordion.Collapse>
							</Accordion>
							</Col>
						</Row>
						<Row style={{width: '100%', justifyContent: 'center'}}>
							<Accordion>
							<Col>
								{/* Render tickets from props */}
								{
									this.props.tickets.length === 0
									?
										<h1>No Tickets Found</h1>
									:
										this.props.tickets.map(ticket => <TicketPreview
											ticket={ticket}
											clients={this.props.clients}
											couriers={this.props.couriers}
											handleUpdate={this.props.handleUpdate}
											handleDelete={this.props.handleDelete}
											selectTicket={this.props.selectTicket}
											activeMenus={this.state.activeMenus}
											toggleActiveMenus={this.toggleActiveMenus}
											/>)
								}
								{ this.props.ticketSearchResultCount
								?
									<Pagination
										activePage={this.props.activePage}
										itemClass="page-item"
										linkClass="page-link"
										itemsCountPerPage={20}
										totalItemsCount={this.props.ticketSearchResultCount}
										pageRangeDisplayed={5}
										onChange={this.props.handlePageChange.bind(this)}
										/>
									: null
								}
							</Col>
						</Accordion>
						</Row>

				</Route>
			</Container>
		)
	}
}

export default TicketList;
