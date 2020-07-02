import React from 'react'
import { Container, Row, Col, Modal, Button, Accordion } from 'react-bootstrap';

import ViewInvoice from './ViewInvoice.js';
import moment from 'moment';


const InvoicePreview = props => {
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { invoice, balance } = props;

  const togglePaid = () => {
    const newTicket = {...invoice}
    newTicket.paid = !newTicket.paid
    props.togglePaid(newTicket)
  }

  return (
    <tr>
      <td>{moment(invoice.created_at).format('L, LT')}</td>
      <td>{invoice.client.name}</td>
      <td>{moment(invoice.start_date).format('L')}</td>
      <td>{moment(invoice.end_date).format('L')}</td>
      <td>{invoice.tickets.length}</td>
      <td>${balance}</td>
      <td>{invoice.paid ? <em>Paid</em> : <strong>UNPAID</strong>}</td>
      <td>
        <Button
          variant='outline-info'
          size='sm'
          onClick={handleShow}
        >
          View or Edit
        </Button>
      </td>

      <Modal show={show} onHide={handleClose} size='xl'>
        <Modal.Header closeButton>
          <Modal.Title>Invoice #{invoice.id} - {invoice.client.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <ViewInvoice invoice={invoice} />
        </Modal.Body>

        <Modal.Footer>
          <Accordion>
            <Row>

              <Accordion.Toggle
                eventKey={'confirmDelete'}
                as={Button}
                variant={'outline-danger'}
                id={'deleteButton'}
              >
                Delete Invoice
              </Accordion.Toggle>

              <Button
                variant={'outline-success'}
                onClick={() => {
                  togglePaid();
                  handleClose();
                }}
              >
                {
                  invoice.paid ? 'Mark UNPAID' : 'Mark PAID'
                }
              </Button>

              <Button
                variant={'outline-secondary'}
                onClick={handleClose}
              >
                  Close
              </Button>

            </Row>
            <Row>
              <Accordion.Collapse eventKey={'confirmDelete'}>
                <Container fluid>
                  <h4 className='title'>Are you sure?<br /> This can not be undone!</h4>
                  <Button
                    variant={'danger'}
                    onClick={() => {
                      props.handleDelete(invoice.id)
                      handleClose();
                    }}
                  block >
                    Confirm Delete
                  </Button>
                </Container>
              </Accordion.Collapse>
            </Row>
          </Accordion>
        </Modal.Footer>
      </Modal>
    </tr>
  )
}

export default InvoicePreview
