import {useState} from 'react';

import {Link, NavLink} from 'react-router-dom';


import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Button} from 'react-bootstrap';

import {useContext} from 'react';

import UserContext from '../UserContext';


export default function AppNavbar() {

    const {user, handleShowCart} = useContext(UserContext);


  return (
    <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">&nbsp;Rico Mart</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
          <Nav>
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/products">Products</Nav.Link>

            { (user.isAdmin)
                &&

                <Nav.Link as={NavLink} to="/admin/dashboard">Admin</Nav.Link>

            }

          </Nav>


          <Nav>

        {(user.isAdmin === false) 
            ?
            <>
          <Navbar.Brand onClick={handleShowCart}style={{cursor: 'pointer'}}>Cart</Navbar.Brand>

            <Navbar.Brand as={Link} to={'/orders'}>Orders</Navbar.Brand>
          </>
            :
            ''
        }

        {(user.isAdmin === true)
        ?
            <>
            <Navbar.Brand as={Link} to={'/admin/orders'}>User Orders</Navbar.Brand>

            </>
        :
        ''

        }

        {(user.isSuperAdmin === true) 
        ?
        <Navbar.Brand as={Link} to={'/admin/users'}>Users</Navbar.Brand>
        :
        ''

        }
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

