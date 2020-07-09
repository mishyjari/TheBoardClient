import React from 'react';
import { Toast, Row, Col } from 'react-bootstrap';

const NewToast = props => {
  const [show, setShow] = React.useState(true);

  const close = () => {
      setShow(false);
      props.handleClose(props.id)
    }

  const toastStyle = {
      width: '20rem',
      margin: '10px',
  }

  const { heading, text } = props

  return (

    <Row style={toastStyle}>
      <Col>
      <Toast show={show} onClose={close} delay={5000} autohide className='toast'>
        <Toast.Header>
          {heading}
        </Toast.Header>
        <Toast.Body>
          {text}
        </Toast.Body>
      </Toast>
      </Col>
    </Row>

  );
}

export default NewToast
