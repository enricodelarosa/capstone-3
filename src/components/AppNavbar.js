import {useState, useEffect} from 'react';

import {Link, NavLink} from 'react-router-dom';


import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Button, Container} from 'react-bootstrap';

import {useContext} from 'react';

import UserContext from '../UserContext';


export default function AppNavbar({clickOutCount}) {

    const {user, handleShowCart} = useContext(UserContext);

    const [expanded, setExpanded] = useState(false);

    const style = {
        color: '#0a4678',
        fontWeight: 'bold'
    }

    useEffect(() => {
        setExpanded(false);
    },[clickOutCount])

  return (
    <Navbar expand="lg" style={{background: '#FFEBAD'}} expanded={expanded}>
    <Container>
        <Navbar.Brand style={style} as={Link} to="/">&nbsp;Rico Mart</Navbar.Brand>

        {(user.isAdmin == false) ?
            <Navbar.Brand className="d-inline d-md-none" as={Link} to="/"onClick={handleShowCart}style={{cursor: 'pointer'}}>Cart</Navbar.Brand>
        :
        ''

        }
        
        <Navbar.Toggle onClick={e => {
            setExpanded(!expanded);
        }}aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-between">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">&nbsp;Home</Nav.Link>
            <Nav.Link as={NavLink} to="/products">&nbsp;Products</Nav.Link>

            { (user.isAdmin)
                &&

                <Nav.Link as={NavLink} to="/admin/dashboard">&nbsp;Admin</Nav.Link>

            }

          </Nav>


          <Nav>

        {(user.isAdmin === false) 
            ?
            <>
          <Navbar.Brand className="d-none d-md-inline" onClick={handleShowCart}style={{cursor: 'pointer'}}>&nbsp;Cart</Navbar.Brand>

            <Navbar.Brand as={Link} to={'/orders'}>&nbsp;Orders</Navbar.Brand>
          </>
            :
            ''
        }

        {(user.isAdmin === true)
        ?
            <>
            <Navbar.Brand as={Link} to={'/admin/orders'}>&nbsp;User Orders</Navbar.Brand>

            </>
        :
        ''

        }

        {(user.isSuperAdmin === true) 
        ?
        <Navbar.Brand as={Link} to={'/admin/users'}>&nbsp;Users</Navbar.Brand>
        :
        ''

        }
            {(user.id !== null) 
                ? 
                    <Nav.Link as={NavLink} to="/logout">&nbsp;Logout</Nav.Link>
                :
                    <>
                    <Nav.Link as={NavLink} to="/login">&nbsp;Login</Nav.Link>
                    <Nav.Link as={NavLink} to="/register">&nbsp;Register</Nav.Link>
                    </>
                }
          </Nav>



        </Navbar.Collapse>
    </Container>
    </Navbar>
  );
}

