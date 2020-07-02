import React from 'react';
import DispatchHome from './components/DispatchHome.js';
import CourierHome from './components/CourierHome.js';
import ClientHome from './components/ClientHome.js';
import PublicHome from './components/PublicHome.js';
import './stylesheets/App.css';
import { Container, Row, Col } from 'react-bootstrap';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import { USERS_API } from './_helpers/Apis.js'
import { Redirect } from 'react-router-dom';

import Meow from './containers/Meow.js'

class App extends React.Component {

  state = {
    userSession: null
  }

  componentWillMount() {
    const user_id = window.localStorage.user_id || window.sessionStorage.user_id
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
      <Container fluid id='main'>
        <Router>
        	<Row>
      			<Col>
      				<h1 className='text-center logo'>
                The Board
              </h1>
      			</Col>
          </Row>

          <Container fluid className='content-main'>
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
      </Container>


    		<div id="footer">
    			<h6>Blah Blah Blah</h6>
    		</div>
      </Router>
    </Container>
    );
  }
}

export default App;
