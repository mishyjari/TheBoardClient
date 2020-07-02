import React from 'react';
import CourierList from '../containers/CourierList.js'
import TicketList from "./TicketList";
import TicketDetail from './TicketDetail.js';
import ClientList from "../containers/ClientList.js";
import StatusBar from "./StatusBar";
import NewTicket from './NewTicket.js';
import SearchForm from './SearchForm.js';
import NewUser from './NewUser.js';
import Invoices from './Invoices.js';
import moment from 'moment';
import { Container, Row, Col, Tab, Tabs, Nav, Button, Alert } from 'react-bootstrap';
import { BrowserRouter as Router, Route, NavLink, Redirect} from 'react-router-dom';
import { TICKETS_API,
	ACTIVE_TICKETS_API,
	TICKETS_TODAY_API,
	CLIENTS_API,
	COURIERS_API,
	INCOMPLETE_COURIER_TICKETS_API,
	INCOMPLETE_UNASSIGNED_TICKETS_API,
	HEADERS } from '../_helpers/Apis.js'

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
		ticketFilterTitle: 'Incomplete and Unassigned Tickets'
	};

	/* INITIAL FETCH - Set state for all clients, all couriers, and select tickets*/

	populateclients = () => {
		// Should fetch only clients with active tickets
		// Possibly include all clients with tickets today (grey out inactive)
		// Hard code to fetch all clients for now.
		fetch(CLIENTS_API)
		.then( res => res.json() )
		.then( clients => this.setState({
			clients: clients,
			// Sort filter by name
			filteredClients: clients.sort((a,b) => (b.name < a.name ? 1 : -1))
		}))
	}

	populatecouriers = () => {
		// Should fetch only couriers marked 'active'
		// Fetch all for now. Constrict once API built out
		fetch(COURIERS_API)
		.then( res => res.json() )
		.then( couriers => this.setState({
			couriers: couriers,
			// set filter by first_name
			filteredCouriers: couriers.filter(c => !c.is_archived).sort((a,b) => (b.first_name < b.first_name ? 1 : -1))
		 }))
	}

	populateTickets = () => {
		fetch(INCOMPLETE_UNASSIGNED_TICKETS_API)
		.then( res => res.json() )
		.then( tickets => this.setState({
			tickets: tickets,
			// Set filteredTickets to descending order by created_at
			filteredTickets: tickets.filter((a,b) => {
				return a.created_at < b.created_at ? 1 : -1
			})
		}))
	}


	componentWillMount() {
		this.populateTickets();
		this.populatecouriers();
		this.populateclients();
	}


	/* ============= TICKET FUNCTIONS ============ */

	/* New Ticket */

	handleNewTicket = data => {
		fetch(TICKETS_API, {
			method: 'POST',
			headers: HEADERS,
			body: JSON.stringify(data)
		})
		.then( res => res.json() )
		.then( newTicket => {
			this.setState(prevState => ({
				tickets: [...prevState.tickets, newTicket],
				filteredTickets: [...prevState.filteredTickets, newTicket].sort((a,b) => {
						return a.created_at < b.created_at ? 1 : -1
				})
			})
		)})
	};

	/* Update Ticket */

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

			// Update the ticket instance in courier's association
			const courier = ticket.courier_id
				? this.state.couriers.find(c => c.id == ticket.courier_id)
				:	null

			if ( courier ) { this.handleUpdateCourier(courier) }

			// Update the ticket instance in client's association
			const client = ticket.client_id
				? this.state.clients.find(c => c.id == ticket.client_id)
				:	null

			if ( client ) { this.handleUpdateClient(client) }

			this.setState({
				tickets: tickets,
			 })
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

	handleFilterTickets = (filter, heading) => {
		this.setState(prevState => ({
			filteredTickets: prevState.tickets.filter(filter),
			ticketFilterTitle: heading
		}))
	}

	handleSortTickets = (col,isDesc) => {
		this.setState(prevState => ({
			filteredTickets: prevState.filteredTickets.sort((a,b) => {
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

	getTicketById = id => {
		return this.state.tickets.find(ticket => ticket.id == id)
	}

	selectTicketById = id => {
		const ticket = this.getTicketById(id);
		this.setState({ selectedTicket: ticket })
	}

	handleSearch = data => {
		const courier = this.state.couriers.find(c => c.full_name === data.courierName)
		const client = this.state.clients.find(cl => cl.name === data.clientName)

		let query = `${TICKETS_API}/search?start=${data.startDate.format()}&end=${data.endDate.format()}`;

		if ( courier ) { query += `&courier_id=${courier.id}` }
		if ( client ) { query += `&client_id=${client.id}` }

		//alert(JSON.stringify(searchData, null, 4))
		fetch(query)
			.then( res => res.json() )
			.then( tickets => this.setState({
				filteredTickets: tickets,
				ticketFilterTitle: 'Search Results'
			}))
	}

	showIncompleteCourierTickets = courier_id => {
		const courier = this.state.couriers.find(c => c.id == courier_id)
		this.setState({
			filteredTickets: courier.incomplete_tickets,
			ticketFilterTitle: `Incomplete Tickets for courier ${courier.full_name}`
		})
	}

	showCourierTicketsToday = courier_id => {
		const courier = this.state.couriers.find(c => c.id == courier_id)
		this.setState({
			filteredTickets: courier.tickets_today,
			ticketFilterTitle: `Ticket Today for courier ${courier.full_name}`
		})
	}

	showIncompleteClientTickets = client_id => {
		const client = this.state.clients.find(c => c.id == client_id)
		this.setState({
			filteredTickets: client.incomplete_tickets,
			ticketFilterTitle: `Incomplete Tickets for client ${client.name}`
		})
	}

	/* =================== COURIER FUNCTIONS ================= */

	toggleShowArchivedCouriers = show => {
		if ( show ) {
			this.setState(prevState => ({ filteredCouriers: prevState.couriers.sort((a,b) => (b.name < a.name ? 1 : -1)) }))
		}
		else {
			this.setState(prevState => ({ filteredCouriers: prevState.couriers.filter(c => !c.is_archived).sort((a,b) => (b.name < a.name ? 1 : -1)) }))
		}
	}

	handleSortCouriers = (col,isDesc) => {
		const filteredCouriers = [...this.state.filteredCouriers].sort((a,b) => {
			return !isDesc ? b[col] < a[col] : a[col] < b[col]
		})
		this.setState(prevState => ({ filteredCouriers }))
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

			this.setState({
				couriers: couriers,
				filteredCouriers: couriers.filter(c => !c.is_archived).sort((a,b) => (b.name < a.name ? 1 : -1)) })
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

	handleFilterCouriers = filter => {
		this.setState(prevState => ({ filteredCouriers: prevState.couriers.filter(filter) }))
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
			const index = couriers.indexOf(deletedCourier);
			couriers.splice(index,1)

			this.setState({
				couriers: couriers,
				filteredCouriers: couriers
			})
		})
	}



	/* ==================== CLIENT FUNCTIONS ====================== */

	handleSortClients = (col,isDesc) => {
		const filteredClients = [...this.state.filteredClients].sort((a,b) => {
			return isDesc ? b[col] < a[col] : a[col] < b[col]
		})
		this.setState(prevState => ({ filteredClients }))
	}

	handleUpdateClient = data => {
		fetch(`${CLIENTS_API}/${data.id}`, {
			method: "PATCH",
			headers: HEADERS,
			body: JSON.stringify(data)
		})
		.then( res => res.json() )
		.then( client => {
			const clients = [...this.state.clients]
			const oldClientData = clients.find(c => c.id === client.id)
			const index = clients.indexOf(oldClientData)

			clients.splice(index,1,client)

			this.setState({
				clients: clients,
				filteredClients: clients
			})
		})
	}

	handleNewClient = clientData => {
		fetch(CLIENTS_API, {
			method: "POST",
			headers: HEADERS,
			body: JSON.stringify(clientData)
		})
		.then( res => res.json() )
		.then( client => {
			const filteredWithNewClient = [...this.state.filteredClients];
			filteredWithNewClient.unshift(client)
			this.setState(prevState => ({
				clients: [...prevState.clients, client],
				filteredClients: filteredWithNewClient
			}))
		})
	}

	handleFilterClients = filter => {
		this.setState(prevState => ({ filteredClients: prevState.clients.filter(filter) }))
	}


	handleDeleteClient = id => {
		fetch(`${CLIENTS_API}/${id}`, {
			method: "DELETE",
			headers: HEADERS
		})
		.then( res => res.json() )
		.then( client => {
			const clients = this.state.clients;

			const deletedClient = clients.find(c => c.id == client.id);
			const index = clients.indexOf(deletedClient);
			clients.splice(index,1)

			this.setState({
				clients: clients,
				filteredClients: clients
			})
		})
	}

	render() {
		return (
			<Container fluid>
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
								</ul>
							</Col>

								<Route path='/dispatch/tickets'>
									<TicketList
										tickets={this.state.filteredTickets}
										searchRes={this.state.ticketSearchResults}
										ticketFilterTitle={this.state.ticketFilterTitle}
										clients={this.state.clients}
										couriers={this.state.couriers}
										selectTicket={this.selectTicketById}
										handleUpdate={this.handleUpdateTicket}
										handleDelete={this.handleDeleteTicket}
										handleSort={this.handleSortTickets}
										handleNewTicket={this.handleNewTicket}
										filterTickets={this.handleFilterTickets}
										search={this.handleSearch}
										handlePageChange={this.fetchTicketPage}
										 />
								</Route>

								<Route path='/dispatch/clients'>
									<ClientList
										clients={this.state.clients}
										filteredClients={this.state.filteredClients}
										filterClients={this.handleFilterClients}
										sortClients={this.handleSortClients}
										editClient={this.handleUpdateClient}
										newClient={this.handleNewClient}
										deleteClient={this.handleDeleteClient}
									/>
								</Route>

								<Route path='/dispatch/couriers'>
									<CourierList
										couriers={this.state.filteredCouriers}
										updateCourier={this.handleUpdateCourier}
										sortCouriers={this.handleSortCouriers}
										filterCouriers={this.handleFilterCouriers}
										deleteCourier={this.handleDeleteCourier}
										newCourier={this.handleNewCourier}
										toggleShowArchived={this.toggleShowArchivedCouriers}
										/>
								</Route>

								<Route path='/dispatch/invoices'>
									<Invoices clients={this.state.clients} />
								</Route>
-
								<Route path='/dispatch/new-user'>
									<NewUser admin={true} />
								</Route>
							</Row>

						</Col>



						<Col sm={3}>
							<StatusBar
							couriers={this.state.couriers}
							clients={this.state.clients}
							selectTicket={this.selectTicketById}
							filterCouriers={this.handleFilterCouriers}
							courierTicketsToday={this.showCourierTicketsToday}
							incompleteCourierTickets={this.showIncompleteCourierTickets}
							clientTickets={this.showIncompleteClientTickets}
							/>

						</Col>
					</Router>
				</Row>


			</Container>
		)
	}
}

export default DispatchHome;
