import React from 'react';
import DispatchHome from './components/DispatchHome.js';
import PublicHome from './components/PublicHome.js';
import './stylesheets/App.css';
import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Meow from './containers/Meow.js'

const App = () => {

  return (
    <Container fluid>
    	<div id="titlebar">
			<span id='title-main-Container'>
				<h1 id="title-main" class='title'>
					The Board
				</h1>
			</span>
			<span id='session-status-Container'>
				{/*
					if !session
						<LoginForm />
					else
						{User Name / Info}
						<Logout Button>
				*/}
			</span>
			<span id="hamburger-menu-Container">
				{/*
					<HamburgerMenu />
				*/}
			</span>
    	</div>

    	<div id="app-body">
        <Router>
        	<Route exact path='/' component={PublicHome} />
          <Route path='/dispatch' render={routerProps => <DispatchHome {...routerProps} />} />
        </Router>
		</div>
		<div id="footer">
			<h6>Blah Blah Blah</h6>
		</div>
  </Container>
  );
}

export default App;
