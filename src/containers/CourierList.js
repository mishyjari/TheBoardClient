import React from 'react';
import CourierPreview from './CourierPreview.js';
import NewCourier from '../components/NewCourier.js'
import CourierShow from '../components/CourierShow.js';
import { Table, Form, Button, Col, Row, Accordion, Container } from 'react-bootstrap';
import { Route } from 'react-router-dom';

class CourierList extends React.Component {

  state = {
    filter: '',
    colSort: 'first_name',
    sortOrderDesc: false,
    showArchived: false,
  }

  toggleActive = courier => {
    courier.is_active = !courier.is_active
    this.props.updateCourier(courier, this.handleSort(this.state.colSort, true))
  }

  handleFilter = e => {
    e.persist();
    const val = e.target.value;

    this.setState({
      filter: val.toLowerCase()
    }, () => {
      this.props.filterCouriers(courier => {
        const { full_name, email, phone } = courier;
        const filter = this.state.filter;
        return full_name.toLowerCase().includes(filter)
         || email.toLowerCase().includes(filter)
         || phone.includes(filter)
      }, this.state.showArchived)
    })
  }

  handleSort = (col, sustainSort) => {
    const willToggle = col === this.state.colSort
    this.setState(prevState => ({
      colSort: col,
      sortOrderDesc: willToggle ? !prevState.sortOrderDesc : prevState.sortOrderDesc
    }), () => {
      this.props.sortCouriers(this.state.colSort,this.state.sortOrderDesc)
    })
  }

  componentDidMount() {
    this.handleSort('first_name',false)
  }

  render() {
    console.log(this.state)
    return (
      <Container fluid className='list-main'>
        <Route exact path='/dispatch/couriers/:id' render={routerProps => <CourierShow
          {...routerProps} />
        } />

        <Route exact path='/dispatch/couriers'>
          <Row>
            <Col sm='3'>
              <Form.Control
                type='text'
                name='filterCourier'
                placeholder="Filter Couriers"
                value={this.state.filter}
                onChange={this.handleFilter}
              />
            </Col>
            <Col>
                <Accordion>
                  <Accordion.Toggle
                    as={Button}
                    variant={'outline-dark'}
                    eventKey={'newCourier'}
                    id='new-courier-toggle'
                    block
                  >
                    New Courier
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={'newCourier'} id={'newCourierToggle'}>
                  <NewCourier handleSubmit={this.props.newCourier} couriers={this.props.couriers}/>
                </Accordion.Collapse>
              </Accordion>
            </Col>
          </Row>
          <Row>
            <Form.Check
              type='switch'
              label='Include Archived Couriers'
              name='showArchivedCouriers'
              id='showArchiveCouriersToggle'
              checked={this.state.showArchived}
              onChange={() => this.setState(prevState => ({
                showArchived: !prevState.showArchived}),
                () => this.props.toggleShowArchived(this.state.showArchived))}
            />
          </Row>
          <Table hover striped>
            <tr>
            </tr>
            <tr>
              <th className='hover-pointer' onClick={() => this.handleSort('first_name')}>Name</th>
              <th className='hover-pointer' onClick={() => this.handleSort('phone')}>Phone Number</th>
              <th className='hover-pointer' onClick={() => this.handleSort('email')}>Email Address</th>
              <th className='hover-pointer' onClick={() => this.handleSort('radio_number')}>Radio Number</th>
              <th className='hover-pointer' onClick={() => this.handleSort('incomplete_tickets')}>Incomplete Tickets</th>
              <th className='hover-pointer' onClick={() => this.handleSort('is_active')}>Active?</th>
              <th></th>
            </tr>
            <tbody>
            {
              this.props.couriers.map(courier => <CourierPreview
                courier={courier}
                couriers={this.props.couriers}
                toggleActive={this.toggleActive}
                updateCourier={this.props.updateCourier}
                deleteCourier={this.props.deleteCourier}
              />)
            }
            </tbody>
          </Table>
        </Route>
      </Container>
    )
  }
}

export default CourierList
