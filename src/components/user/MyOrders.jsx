import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function MyOrders() {
  return (
    <>
      <Container className="mt-4">
        <Row className="mb-3">
          <Col sm={12} md={4} className="mb-2">
            <h3 className='text-center'>My Orders</h3>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default MyOrders