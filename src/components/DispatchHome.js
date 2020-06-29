import React from 'react';
import CourierList from '../containers/CourierList.js'
import TicketList from "./TicketList";
import TicketDetail from './TicketDetail.js';
import ClientList from "../containers/ClientList.js";
import StatusBar from "./StatusBar";
import NewTicket from './NewTicket.js';
import SearchForm from './SearchForm.js';
import NewUser from './NewUser.js';
import moment from 'moment';
import { Container, Row, Col, Tab, Tabs, Nav, Button, Alert } from 'react-bootstrap';
import { BrowserRouter as Router, Route, NavLink} from 'react-router-dom';
import { TICKETS_API, ACTIVE_TICKETS_API, TICKETS_TODAY_API, CLIENTS_API, COURIERS_API, HEADERS } from '../_helpers/Apis.js'

class DispatchHome extends React.Component {

	state = {
		clients: [],
		couriers: [],
		ticketsToday: [],
		filteredClients: [],
		filteredCouriers: [],
		ticketSearchResults: [],
		ticketsLoaded: false,
		filteredTickets: [],
		ticketFilters: ['Incomplete']
	};

	populateclients = () => {
		// Should fetch only clients with active tickets
		// Possibly include all clients with tickets today (grey out inactive)
		// Hard code to fetch all clients for now.
		fetch(CLIENTS_API)
		.then( res => res.json() )
		.then( clients => this.setState({
			clients: clients,
			filteredClients: clients.sort((a,b) => b.name < a.name ? 1 : -1)
		}))
	}

	populatecouriers = () => {
		// Should fetch only couriers marked 'active'
		// Fetch all for now. Constrict once API built out
		fetch(COURIERS_API)
		.then( res => res.json() )
		.then( couriers => this.setState({
			couriers: couriers,
			filteredCouriers: couriers.sort((a,b) => a.created_at < b.created_at)
		 }))
	}

	fetchTicketsToday = () => {
		fetch(TICKETS_TODAY_API)
		.then( res => res.json() )
		.then( ticketsToday => this.setState({
				ticketsToday: ticketsToday,
				filteredTickets: ticketsToday
			}, () => {
			this.handleFilterTickets(ticket => !ticket.is_complete)
		}))
	}

	fetchActiveTickets = () => {
		fetch(ACTIVE_TICKETS_API)
		.then( res => res.json() )
		.then( filteredTickets => this.setState({ filteredTickets }) )
	}

	handleNewTicket = data => {
		fetch(TICKETS_API, {
			method: 'POST',
			headers: HEADERS,
			body: JSON.stringify(data)
		})
		.then( res => res.json() )
		.then( newTicket => {
			console.log(newTicket)
			this.setState(prevState => ({
				filteredTickets: [...prevState.filteredTickets, newTicket].sort((a,b) => {
						return a.created_at < b.created_at
					})
			})
		)})
	};

	handleUpdateTicket = ticket => {
		fetch(`${TICKETS_API}/${ticket.id}`, {
			method: 'PATCH',
			headers: HEADERS,
			body: JSON.stringify(ticket)
		})
		.then( res => res.json() )
		.then( ticket => {
			const tickets = this.state.filteredTickets;
			const oldTicket = tickets.find(t => t.id === ticket.id)
			tickets.splice(tickets.indexOf(oldTicket),1,ticket)

			this.setState({ tickets })
		})
	}

	handleDeleteTicket = id => {
		fetch(`${TICKETS_API}/${id}`, {
			method: "DELETE",
			headers: HEADERS
		})
		.then( res => res.json() )
		.then( ticket => {
			const tickets = this.state.filteredTickets
			const deletedTicket = tickets.find(t => t.id === ticket.id);
			const index = tickets.indexOf(deletedTicket);
			tickets.splice(index,1)

			this.setState({ tickets })
		})
	}

	handleSortTickets = (col,isDesc) => {

		this.setState(prevState => ({
			tickets: prevState.filteredTickets.sort((a,b) => {
				// Active Record timestamps dont play well with moment.js sort. Convert them.
				if ( col === 'created_at' ) {
					return isDesc
					?
						moment(b[col]) - moment(a[col])
					:
						moment(a[col]) - moment(b[col])
				} else {
					return isDesc ? a[col] < b[col] : a[col] > b[col]
				}
			})
		}))
	}

	handleSortCouriers = (col,isDesc) => {
		const filteredCouriers = [...this.state.filteredCouriers].sort((a,b) => {
			return !isDesc ? b[col] < a[col] : a[col] < b[col]
		})
		this.setState(prevState => ({ filteredCouriers }))
	}

	handleSortClients = (col,isDesc) => {
		const filteredClients = [...this.state.filteredClients].sort((a,b) => {
			return isDesc ? b[col] < a[col] : a[col] < b[col]
		})
		this.setState(prevState => ({ filteredClients }))
	}

	getTicketById = id => {
		return this.state.tickets.find(ticket => ticket.id == id)
	}

	selectTicketById = id => {
		const ticket = this.getTicketById(id);
		this.setState({ selectedTicket: ticket })
	}


	handleUpdateCourier = courierData => {
		fetch(`${COURIERS_API}/${courierData.id}`, {
			method: "PATCH",
			headers: HEADERS,
			body: JSON.stringify(courierData)
		})
		.then( res => res.json() )
		.then( courier => {
			const couriers = [...this.state.couriers]
			const oldData = couriers.find(c => c.id == courier.id)
			const index = couriers.indexOf(oldData)

			couriers.splice(index,1,courier)

			this.setState({ couriers })
		})
	}

	handleNewCourier = courierData => {
		fetch(COURIERS_API, {
			method: "POST",
			headers: HEADERS,
			body: JSON.stringify(courierData)
		})
		.then( res => res.json() )
		.then( courier => this.setState(prevState => ({
			couriers: [...prevState.couriers, courier],
			filteredCouriers: [...prevState.filteredCouriers, courier].sort((a,b) => {
					return a.created_at < b.created_at
				})
			})
		))
	}

	handleFilterClients = filter => {
			this.setState(prevState => ({ filteredClients: prevState.clients.filter(filter) }))
	}

	handleFilterCouriers = filter => {
		this.setState(prevState => ({ filteredCouriers: prevState.couriers.filter(filter) }))
	}

	handleFilterTickets = filter => {
		this.setState(prevState => ({ filteredTickets: prevState.ticketsToday.filter(filter) }))
	}

	handleDeleteCourier = id => {
		fetch(`${COURIERS_API}/${id}`, {
			method: 'DELETE',
			headers: HEADERS
		})
		.then( res => res.json() )
		.then( courier => {
			const couriers = this.state.couriers;
			const deletedCourier = couriers.find(c => c.id == courier.id);
			console.log(deletedCourier)
			const index = couriers.indexOf(deletedCourier);
			console.log(index)
			couriers.splice(index,1)
			console.log(couriers)

			this.setState({
				couriers: couriers,
				filteredCoutiers: couriers
			})
		})
	}

	componentWillMount() {
		// Fetch with args ['unassigned', 'incomplete'] on first mount
		// Hard coded for now (in handleTicketFilter()). Update once api built out
		this.fetchTicketsToday();
		this.populatecouriers();
		this.populateclients();
	}

	handleSearch = data => {
		console.log(data)
		const courier = this.state.couriers.find(c => c.full_name === data.courierName)
		const client = this.state.clients.find(cl => cl.name === data.clientName)

		let query = `${TICKETS_API}/search?start=${data.startDate.format()}&end=${data.endDate.format()}`;

		if ( courier ) { query += `&courier_id=${courier.id}` }
		if ( client ) { query += `&client_id=${client.id}` }

		//alert(JSON.stringify(searchData, null, 4))
		fetch(query)
			.then( res => res.json() )
			.then( tickets => this.setState({
				filteredTickets: tickets
			}))
	}

	componentWillRecieveProps() {
		console.log('will recieve')
		console.log(this.state.selectedTicket)
	}

	render() {
		console.log(this.state)
		return (
			<Container fluid>
				<Row>
					<h3 className='title'>Dispatch Home</h3>
				</Row>

				<Row>
					<Router>
						<Col>
							<Row>
								<Col>

								<ul className='nav nav-tabs' role='tablist'>
									<li className='nav-item'>
										<NavLink
											to='/dispatch/tickets'
											className='nav-link'
											data-toggle='tab'
											role='tab'
											aria-controls='tickets'
											selected='true'
											>
											Tickets
										</NavLink>
									</li>

									<li className='nav-item'>
										<NavLink
											to='/dispatch/clients'
											className='nav-link'
											data-toggle='tab'
											role='tab'
											aria-controls='clients'
											selected='false'
											>
											Clients
										</NavLink>
									</li>

									<li className='nav-item'>
										<NavLink
											to='/dispatch/couriers'
											className='nav-link'
											data-toggle='tab'
											role='tab'
											aria-controls='clients'
											selected='false'
											>
											Couriers
										</NavLink>
									</li>

									<li className='nav-item'>
										<NavLink
											to='/dispatch/invoices'
											className='nav-link'
											data-toggle='tab'
											role='tab'
											aria-controls='invoices'
											selected='false'
											>
											Invoices
										</NavLink>
									</li>

										<li className='nav-item'>
											<NavLink
												to='/dispatch/new-user'
												className='nav-link'
												data-toggle='tab'
												role='tab'
												aria-controls='newUser'
												selected='true'
												>
												New User
											</NavLink>
										</li>

									</ul>
							</Col>
							</Row>



							<Row>

								<Route path='/dispatch/tickets'>
									<TicketList
										tickets={this.state.filteredTickets}
										searchRes={this.state.ticketSearchResults}
										clients={this.state.clients}
										couriers={this.state.couriers}
										selectTicket={this.selectTicketById}
										handleUpdate={this.handleUpdateTicket}
										handleDelete={this.handleDeleteTicket}
										handleSort={this.handleSortTickets}
										handleNewTicket={this.handleNewTicket}
										filterTickets={this.handleFilterTickets}
										search={this.handleSearch}

										 />
								</Route>

								<Route path='/dispatch/clients'>
										<ClientList
											clients={this.state.filteredClients}
											filterClients={this.handleFilterClients}
										/>
								</Route>

								<Route path='/dispatch/couriers'>
									<CourierList
										couriers={this.state.couriers}
										filteredCouriers={this.state.filteredCouriers}
										updateCourier={this.handleUpdateCourier}
										sortCouriers={this.handleSortCouriers}
										filterCouriers={this.handleFilterCouriers}
										deleteCourier={this.handleDeleteCourier}
										newCourier={this.handleNewCourier}
										/>
								</Route>

								<Route path='/dispatch/invoices'>
									<h4>Invoices</h4>
								</Route>

								<Route path='/dispatch/new-user'>
									<NewUser admin={true} />
								</Route>
							</Row>

						</Col>
					</Router>


					<Col sm={3}>
						<StatusBar
						couriers={this.state.couriers}
						clients={this.state.clients}
						selectTicket={this.selectTicketById}
						filterCouriers={this.handleFilterCouriers}
						/>

					</Col>
				</Row>

			</Container>
		)
	}
}

export default DispatchHome;
