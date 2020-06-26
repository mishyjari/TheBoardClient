import React from 'react';
import CourierPreview from './CourierPreview.js';
import NewCourier from '../components/NewCourier.js'
import { Table, Form, Button, Col, Row, Accordion, Container } from 'react-bootstrap';

class CourierList extends React.Component {

  state = {
    filter: '',
    colSort: 'first_name',
    sortOrderDesc: false
  }

  toggleActive = courier => {
    courier.is_active = !courier.is_active
    this.props.updateCourier(courier)
  }

  handleFilter = e => {
    e.persist();
    const val = e.target.value;

    this.setState({
      filter: val.toLowerCase()
    }, () => {
      this.props.filterCouriers(courier => {
        const { full_name, email, phone } = courier;
        return full_name.toLowerCase().includes(val)
         || email.toLowerCase().includes(val)
         || phone.includes(val)
      })
    })
  }

  handleSort = (col) => {
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
    return (
      <Container fluid>
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
        <Table hover striped>
          <tr>
          </tr>
          <tr>
            <th className='hover-pointer' onClick={() => this.handleSort('first_name')}>Name</th>
            <th className='hover-pointer' onClick={() => this.handleSort('phone')}>Phone Number</th>
            <th className='hover-pointer' onClick={() => this.handleSort('email')}>Email Address</th>
            <th className='hover-pointer' onClick={() => this.handleSort('radio_number')}>Radio Number</th>
            <th className='hover-pointer' onClick={() => alert("Sort by ticket count not implemented")}>Incomplete Tickets</th>
            <th className='hover-pointer' onClick={() => this.handleSort('is_active')}>Active?</th>
            <th></th>
          </tr>
          <tbody>
          {
            this.props.filteredCouriers.map(courier => <CourierPreview
              courier={courier}
              toggleActive={this.toggleActive}
              updateCourier={this.props.updateCourier}
              deleteCourier={this.props.deleteCourier}
              />)
          }
          </tbody>
        </Table>
      </Container>
    )
  }
}

export default CourierList
