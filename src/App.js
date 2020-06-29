import React from 'react';
import DispatchHome from './components/DispatchHome.js';
import CourierHome from './components/CourierHome.js';
import ClientHome from './components/ClientHome.js';
import PublicHome from './components/PublicHome.js';
import './stylesheets/App.css';
import { Container, Row, Col, NavLink } from 'react-bootstrap';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { USERS_API } from './_helpers/Apis.js'
import { Redirect } from 'react-router-dom';

import Meow from './containers/Meow.js'

class App extends React.Component {

  state = {
    userSession: null
  }

  componentWillMount() {
    const user_id = window.localStorage.user_id || window.sessionStorage.user_id
    console.log(user_id)
    if ( user_id ) {
      fetch(`USERS_API/${user_id}`)
        .then( res => res.json() )
        .then( user => this.setState({ userSession: user }) )
    }
  }

  setUser = (user, saveSession) => {
    this.setState({ userSession: user }, () => {
      saveSession
      ?
        window.localStorage.user_id = this.state.userSession.id
      :
        window.sessionStorage.user_id = this.state.userSession.id
    })
  }

  handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    this.setState({ userSession: null }, () => console.log('logout'))
  }

  render() {
    return (
      <Container fluid>
        <Router>
        	<Row>
      			<Col>
      				<NavLink
                as="h1"
                to='/'
              >
                The Board
              </NavLink>
      			</Col>
      			<Col>
      				{
                this.state.userSession
                ?
                  <Col>
                    <h5>Logged in as {this.state.userSession.username}</h5>
                  </Col>
                :
                  <Col>
                    <h5>Not Logged In</h5>
                  </Col>
              }
      			</Col>
      			<Col>
      				{/*
      					<HamburgerMenu />
      				*/}
      			</Col>
          </Row>

        	<div id="app-body">

        	<Route exact path='/' render={() => <PublicHome
              userSession={this.state.userSession}
              setUser={this.setUser}
              logout={this.handleLogout}
              />}
            />
          <Route path='/dispatch' render={routerProps => <DispatchHome
              {...routerProps}
              userSession={this.state.userSession}
            />}
          />
        <Route path='/CourierHome/:id' render={routerProps => <CourierHome
            {...routerProps}
            />}
          />
        <Route path='/ClientHome/:id' render={routerProps => <ClientHome
            {...routerProps}
            />}
          />

    		</div>
    		<div id="footer">
    			<h6>Blah Blah Blah</h6>
    		</div>
      </Router>
    </Container>
    );
  }
}

export default App;
