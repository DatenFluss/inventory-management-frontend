import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function DashboardPage() {
    return (
        <Container className="mt-5">
            <h2>Dashboard</h2>
            <Row>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>User Information</Card.Title>
                            <Card.Text>
                                {/* Display user info */}
                                Username: johndoe
                                <br />
                                Email: johndoe@example.com
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Inventory Items</Card.Title>
                            {/* Display inventory items in a table or list */}
                            <p>No items to display.</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default DashboardPage;
