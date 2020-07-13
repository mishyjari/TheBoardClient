import React from 'react';
import CourierList from '../containers/CourierList.js'
import TicketList from "./TicketList";
import ClientList from "../containers/ClientList.js";
import StatusBar from "./StatusBar";
import NewUser from './NewUser.js';
import Invoices from './Invoices.js';
import NewToast from './NewToast.js';
import moment from 'moment';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import { TICKETS_API,
	TICKETS_TODAY_API,
	CLIENTS_API,
	COURIERS_API,
	HEADERS } from '../_helpers/Apis.js'

class DispatchHome extends React.Component {

	state = {
		clients: [],
		filteredClients: [],
		couriers: [],
		ticketsToday: [],
		filteredCouriers: [],
		ticketSearchResultCount: null,
		ticketsLoaded: false,
		filteredTickets: [],
		ticketFilterTitle: 'Incomplete and Unassigned Tickets',
		prevSearch: null,
		activePage: 1,
		toasts: [],
		showStatusBar: true,
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
				.filter(c => !c.is_archived),
			prevQuery: CLIENTS_API
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
			filteredCouriers: couriers.sort((a,b) => (a.first_name < b.first_name ? 1 : -1))
				.filter(c => !c.is_archived)
		 }))
	}

	populateTickets = () => {
		fetch(TICKETS_TODAY_API)
		.then( res => res.json() )
		.then( tickets => this.setState({
			tickets: tickets,
			// Set filteredTickets to descending order by created_at
			filteredTickets: tickets.filter(ticket => !ticket.is_complete)
			.sort((a,b) => {
				return moment(a.time_due) > moment(b.time_due)
			}),
			ticketSearchResultCount: null,
			ticketFilterTitle: 'Incomplete and Unassigned Tickets',
		}))
	}


	componentDidMount() {
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
			}), () => this.handleNewToast('Success', `Ticket #${newTicket.id} Created!`)
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
				? this.state.couriers.find(c => c.id === ticket.courier_id)
				:	null

			if ( courier ) { this.handleUpdateCourier(courier) }

			// Update the ticket instance in client's association
			const client = ticket.client_id
				? this.state.clients.find(c => c.id === ticket.client_id)
				:	null

			if ( client ) { this.handleUpdateClient(client) }

			this.setState({
				tickets: tickets,
			}, () => this.handleNewToast('Success', `Ticket #${ticket.id} Updated!`))
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

			this.setState({ tickets }, () => this.handleNewToast('Success', `Ticket #${ticket.id} Deleted!`))
		})
	}

	handleFilterTickets = (filter, heading) => {
		this.setState(prevState => ({
			filteredTickets: prevState.tickets.filter(filter),
			ticketFilterTitle: heading,
			ticketSearchResultCount: null
		}), () => this.handleNewToast('Filter Set', `Ticket filter set to ${heading}`))
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
		}), () => this.handleNewToast('Sort Set', `Sorting by property '${col}'`))
	}

	getTicketById = id => {
		return this.state.tickets.find(ticket => ticket.id === Number(id))
	}

	selectTicketById = id => {
		const ticket = this.getTicketById(id);
		this.setState({ selectedTicket: ticket })
	}

	handleSearch = (data, page) => {

		data = data ? data : this.state.prevSearch;
		page = page ? page : 1;

		const courier = this.state.couriers.find(c => c.full_name === data.courierName)
		const client = this.state.clients.find(cl => cl.name === data.clientName)

		let query = `${TICKETS_API}/search?start=${data.startDate.format()}&end=${data.endDate.format()}`;

		if ( courier ) { query += `&courier_id=${courier.id}` }
		if ( client ) { query += `&client_id=${client.id}` }

		const filterTitle = courier && client ? `matching client ${client.name} and courier ${courier.full_name}`
			: courier && !client ? `matching courier ${courier.full_name}`
			: !courier && client ? `matching client ${client.name}`
			: ''

		//alert(JSON.stringify(searchData, null, 4))
		fetch(query + `&page=${page}`)
			.then( res => res.json() )
			.then( tickets => this.setState({
				filteredTickets: tickets.tickets,
				ticketSearchResultCount: tickets.count,
				ticketFilterTitle: `${tickets.count} Search Results ${filterTitle}`,
				prevSearch: data
			}))
	}

	handlePageChange = page => {
		this.setState({ activePage: page }, () => {
			this.handleSearch(this.state.prevSearch, this.state.activePage)
		})
	}

	showIncompleteCourierTickets = courier_id => {
		const courier = this.state.couriers.find(c => c.id === Number(courier_id))
		this.setState({
			filteredTickets: courier.incomplete_tickets,
			ticketFilterTitle: `Incomplete Tickets for courier ${courier.full_name}`
		})
	}

	showCourierTicketsToday = courier_id => {
		const courier = this.state.couriers.find(c => c.id === Number(courier_id))
		this.setState({
			filteredTickets: courier.tickets_today,
			ticketFilterTitle: `Ticket Today for courier ${courier.full_name}`
		})
	}

	showIncompleteClientTickets = client_id => {
		const client = this.state.clients.find(c => c.id === Number(client_id))
		this.setState({
			filteredTickets: client.incomplete_tickets,
			ticketFilterTitle: `Incomplete Tickets for client ${client.name}`
		})
	}

	/* =================== COURIER FUNCTIONS ================= */

	toggleShowArchivedCouriers = show => {
		if ( show ) {
			this.setState(prevState => ({ filteredCouriers: prevState.couriers.sort((a,b) => (b.first_name < a.first_name ? 1 : -1)) }))
		}
		else {
			this.setState(prevState => ({ filteredCouriers: prevState.couriers.filter(c => !c.is_archived).sort((a,b) => (b.name < a.name ? 1 : -1)) }))
		}
	}

	handleSortCouriers = (col, isDesc ) => {
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
			const oldData = couriers.find(c => c.id === courier.id)
			const index = couriers.indexOf(oldData)

			const filteredCouriers = [...this.state.filteredCouriers]
			const oldFilteredData = filteredCouriers.find(c => c.id === courier.id)
			const filteredIndex = filteredCouriers.indexOf(oldFilteredData)

			couriers.splice(index,1,courier)
			filteredIndex >= 0
			?
				filteredCouriers.splice(filteredIndex, 1, courier)
			:
				filteredCouriers.push(courier)

			this.setState({
				couriers: couriers,
				filteredCouriers: filteredCouriers
				}, () => this.handleNewToast('Success', `Courier #${courier.id} Updated!`) )})
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
			}
		), () => this.handleNewToast('Success', `Courier #${courier.id} Created!`)))
	}

	handleFilterCouriers = (filter, showArchived) => {
		if ( showArchived ) {
			this.setState(prevState => ({ filteredCouriers: prevState.couriers.filter(filter) }))
		} else {
			this.setState(prevState => ({ filteredCouriers: prevState.couriers.filter(filter)
			 	.filter(c => !c.is_archived )}))
		}
	}


	handleDeleteCourier = id => {
		fetch(`${COURIERS_API}/${id}`, {
			method: 'DELETE',
			headers: HEADERS
		})
		.then( res => res.json() )
		.then( courier => {
			const couriers = this.state.couriers;
			const deletedCourier = couriers.find(c => c.id === courier.id);
			const index = couriers.indexOf(deletedCourier);
			couriers.splice(index,1)

			this.setState({
				couriers: couriers,
				filteredCouriers: couriers
			}, () => this.handleNewToast('Success', `Courier #${courier.id} Deleted!`))
		})
	}



	/* ==================== CLIENT FUNCTIONS ====================== */

	toggleShowArchivedClients = show => {
		if ( show ) {
			this.setState(prevState => ({ filteredClients: prevState.clients.sort((a,b) => (b.name < a.name ? 1 : -1)) }))
		}
		else {
			this.setState(prevState => ({ filteredClients: prevState.clients.filter(c => !c.is_archived).sort((a,b) => (b.name < a.name ? 1 : -1)) }))
		}
	}

	handleSortClients = (col,isDesc) => {
		const filteredClients = [...this.state.filteredClients].sort((a,b) => {
			return isDesc ? b[col] < a[col] : a[col] < b[col]
		})
		this.setState(prevState => ({ filteredClients }))
	}

	handleUpdateClient = (data, callback) => {
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
				filteredClients: clients.filter(c => !c.is_archived)
			}, () => this.handleNewToast('Success', `Client #${client.id} Updated!`))
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
				filteredClients: filteredWithNewClient.filter(c => !c.is_archived)
			}), () => this.handleNewToast('Success', `Client #${client.id} Created!`))
		})
	}

	handleFilterClients = (filter, showArchived) => {
		if ( showArchived ){
			this.setState(prevState => ({ filteredClients: prevState.clients.filter(filter) }))
		} else {
			this.setState(prevState => ({ filteredClients: prevState.clients.filter(filter).filter(c => !c.is_archived) }))
		}
	}


	handleDeleteClient = id => {
		fetch(`${CLIENTS_API}/${id}`, {
			method: "DELETE",
			headers: HEADERS
		})
		.then( res => res.json() )
		.then( client => {
			const clients = this.state.clients;

			const deletedClient = clients.find(c => c.id === client.id);
			const index = clients.indexOf(deletedClient);
			clients.splice(index,1)

			this.setState({
				clients: clients,
				filteredClients: clients.filter(c => !c.is_archived)
			}, () => this.handleNewToast('Success', `Client #${client.id} Deleted!`))
		})
	}

	handleNewToast = (heading, text) => {
		const handleClose = id => {
			const toasts = this.state.toasts;
			toasts.splice(toasts.indexOf(toasts.find(t => t.id === Number(id))), 1)
			this.setState({ toasts })
		}
		const toast = <NewToast
			id={`toast-${new Date().getTime()}`}
			heading={heading}
			text={text}
			handleClose={handleClose}
		/>
		this.setState(prevState => ({ toasts: [...prevState.toasts, toast]}))
	}

	toggleShowStatusBar = () => {
		this.setState(prevState => ({ showStatusBar: !prevState.showStatusBar }))
	}

	render() {
		return (
			<Container fluid>
				<Row aria-live="assertive"
  				aria-atomic="true"
					id='toast-container'
  				style={{
			    position: 'absolute',
					top: 0,
					right: 0,
			    minHeight: '200px',
			  	}}>
					<div

			    style={{
			      position: 'absolute',
			      top: 0,
			      right: '30px',
			    }}
			  >
					{
						this.state.toasts.map(t => t)
					}
				</div>
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
											selected={true}
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
											selected={false}
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
											selected={false}
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
											selected={false}
											>
											Invoices
										</NavLink>
									</li>
								</ul>
							</Col>

								<Route path='/dispatch/tickets'>
									<TicketList
										tickets={this.state.filteredTickets}

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
										prevQuery={this.state.prevQuery}
										ticketSearchResultCount={this.state.ticketSearchResultCount}
										handlePageChange={this.handlePageChange}
										activePage={this.state.activePage}
										reset={this.populateTickets}
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
										toggleShowArchived={this.toggleShowArchivedClients}
										handleSearch={this.handleSearch}
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
										handleSearch={this.handleSearch}
										/>
								</Route>

								<Route path='/dispatch/invoices'>
									<Invoices
										clients={this.state.clients}
										newToast={this.handleNewToast}
									/>
								</Route>

								<Route path='/dispatch/new-user'>
									<NewUser admin={true} />
								</Route>
							</Row>

						</Col>


						<Button
							onClick={this.toggleShowStatusBar}
							variant='light'
							id={this.state.showStatusBar ? 'hide-statusbar-btn' : 'show-statusbar-btn'}
						>
							<strong
								id={this.state.showStatusBar ? 'hide-statusbar-btn-label' : 'show-statusbar-btn-label'}>
								{this.state.showStatusBar ? '>' : '<'}
							</strong>
						</Button>

						<Col
							sm={3}
							className={this.state.showStatusBar ? 'status-bar' : 'hidden'}
							id='status-bar-container'
						>
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
