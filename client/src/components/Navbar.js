import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

const NavBar = ({ account, onLogout }) => {
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>
          Crypto Payment DApp
        </Navbar.Brand>
        <Nav className="ms-auto">
          <NavLink to="/products" className="nav-link">Products</NavLink>
          <NavLink to="/history" className="nav-link">History</NavLink>
          {account && (
            <Navbar.Text className="mx-3">
              {account.slice(0, 6)}...{account.slice(-4)}
            </Navbar.Text>
          )}
          <Button variant="outline-light" size="sm" onClick={onLogout}>Logout</Button>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
