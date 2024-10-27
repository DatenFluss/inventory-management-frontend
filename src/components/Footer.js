import React from 'react';
import { Container } from 'react-bootstrap';

function Footer() {
    return (
        <footer className="footer bg-light text-center mt-5 py-3">
            <Container>
        <span className="text-muted">
          &copy; {new Date().getFullYear()} Inventory Management System
        </span>
            </Container>
        </footer>
    );
}

export default Footer;
