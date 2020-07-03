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
		prevSearch: null,
		activePage: 1,
	}

	handleSearch = data => {
			this.setState({ prevSearch: data }, () => {
				this.props.search(this.state.prevSearch, this.state.activePage)
			})
	}

	handlePageChange = page => {
		this.setState({ activePage: page }, () => {
			this.handleSearch(this.state.prevSearch)
		})
	}

	componentDidRecieveProps() {
		this.setState({ totalResults: this.props.ticketSearchResultCount }, () => console.log(this.state))
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
					<Accordion>
						<Row>
							<Col>
							<h4 className='sub-sub-heading'>Displaying {this.props.ticketFilterTitle}</h4>
							{ this.props.ticketSearchResultCount
							?
								<Pagination
									activePage={this.state.activePage}
									itemClass="page-item"
									linkClass="page-link"
									itemsCountPerPage={20}
									totalItemsCount={this.props.ticketSearchResultCount}
									pageRangeDisplayed={5}
									onChange={this.handlePageChange.bind(this)}
									/>
								: null
							}

							</Col>
						</Row>

					<Row>
						<Col>
								{/* New ticket toggle */}
								<Accordion.Toggle
									as={Button}
									variant={'outline-dark'}
									eventKey={'newTicket'}
									id={'new-ticket-btn'}
									className='form-toggle-btn'
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
									eventKey={'searchToggle'}
									id={'search-toggle-btn'}
									className='form-toggle-btn'
									block
								>
									Filters and Search
								</Accordion.Toggle>

								<Accordion.Collapse
									className='content-main'
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
										search={this.handleSearch}
									/>
									</Col>
								</Accordion.Collapse>
							</Col>
						</Row>
						<Row>
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
											/>)
								}
								{ this.props.ticketSearchResultCount
								?
									<Pagination
										activePage={this.state.activePage}
										itemClass="page-item"
										linkClass="page-link"
										itemsCountPerPage={20}
										totalItemsCount={this.props.ticketSearchResultCount}
										pageRangeDisplayed={5}
										onChange={this.handlePageChange.bind(this)}
										/>
									: null
								}
							</Col>
						</Row>
					</Accordion>
				</Route>
			</Container>
		)
	}
}

export default TicketList;
