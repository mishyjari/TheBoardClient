import React from 'react';
import moment from 'moment';
import { Container, Form, Col } from 'react-bootstrap';

export const DateAndTimeSelector = props => {
  console.log(props.dateFromState)
  return (
    <Container fluid>

    </Container>
  )
}

export const dateSelector = callback => {
  const years = () => {
    const years = [];
    let year = 2000;
    while ( year <= moment().year() ) {
      years.push(year);
      year += 1;
    }
    return years;
  }
  const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <Container>
      <Form.Row>
      <Form.Group as={Col}>
        <Form.Label>Month: </Form.Label>
        <Form.Control
          defaultValue={moment().format('MMM')}
          as="select"
          name={`month`}
          onChange={callback}
        >
        {
          months.map(mo => <option>{mo}</option>)
        }
        </Form.Control>
      </Form.Group>
      <Form.Group as={Col}>
      <Form.Label>Year: </Form.Label>
        <Form.Control
          defaultValue={moment().format('YYYY')}
          as="select"
          name={`year`}
          onChange={callback}
        >
        {
          years().map(y => <option>{y}</option>)
        }
        </Form.Control>
      </Form.Group>
    </Form.Row>
    </Container>
  )
}

export const prefixZero = num => {
  return Number(num) < 10 ? `0${num}` : num
}

export const formatDateForInput = d => {
  // Handle null args
  if (d){
    return `${d.year()}-${this.prefixZero(d.month()+1)}-${this.prefixZero(d.date())}`
  } else { return null }
}

export const setDateFromForm = (dateString,isEod) => {
  const d = dateString.split('-');
  return moment({'year': Number(d[0]), 'month': this.prefixZero(d[1])-1, 'day': this.prefixZero(d[2])})
}
