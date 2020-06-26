import React from 'react';
import NewTicket from '../components/NewTicket.js';
import { BrowserRouter as Router, NavLink, Route } from 'react-router-dom';
import { Accordion, Button, Tab, Nav, Row, Col } from 'react-bootstrap';


const Meow= props => {

	return (
		<Tab.Container id="left-tabs-example" defaultActiveKey="first">
	  <Row>{/*
	    <Col sm={3}>
	      <Nav variant="pills" className="flex-column">
	        <Nav.Item>
	          <Nav.Link as={NavLink to=} eventKey="first" href='/meow/first'>Tab 1</Nav.Link>
	        </Nav.Item>
	        <Nav.Item>
	          <Nav.Link eventKey="second" href='/meow/second'>Tab 2</Nav.Link>
	        </Nav.Item>
	      </Nav>
	    </Col>
	    <Col sm={9}>
	      <Tab.Content>
	        <Tab.Pane eventKey="first">
	          <h1> FIRST </h1>
	        </Tab.Pane>
	        <Tab.Pane eventKey="second">
	          <h1> SECOND </h1>
	        </Tab.Pane>
	      </Tab.Content>
	    </Col>
	 */} </Row>
	</Tab.Container>
	)
}

export default Meow
