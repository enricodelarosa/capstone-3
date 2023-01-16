import {useState} from 'react';

import {Link, NavLink} from 'react-router-dom';


import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import {useContext} from 'react';

import UserContext from '../UserContext';


export default function AppNavbar() {

    const {user} = useContext(UserContext);


  return (
    <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">Zuitt</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
          <Nav>
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/products">Products</Nav.Link>

          </Nav>


          <Nav>
            {(user.id !== null) 
                ? 
                    <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
                :
                    <>
                    <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                    <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
                    </>
                }
          </Nav>



        </Navbar.Collapse>
    </Navbar>
  );
}

