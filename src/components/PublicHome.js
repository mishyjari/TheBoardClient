import React from 'react';
import Login from './Login.js';
import NewUser from './NewUser.js';
import { Container, Row, Col, Form, Button, Tabs, Tab } from 'react-bootstrap';

class PublicHome extends React.Component {
  render() {
    return (
      <Container fluid>
        <Row>
          <Col md={2} className="bordered">
            <Tabs id={'publicLoginOrRegisterForm'} defaultActiveKey={'login'}>
              <Tab eventKey={'login'} title={'Login'}>
                {
                  this.props.userSession
                  ?
                    <Container>
                      <h3>Logged In as <em>{this.props.userSession.username}</em></h3>
                      <Button onClick={this.props.logout}>
                        Logout
                      </Button>
                    </Container>
                  :
                    <Login setUser={this.props.setUser}/>
                }
              </Tab>
              <Tab eventKey={'register'} title={'Register'}>
                <NewUser />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    )
  }
};

export default PublicHome;
