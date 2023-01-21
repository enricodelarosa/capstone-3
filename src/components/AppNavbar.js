import { useState, useEffect } from 'react';

import { Link, NavLink } from 'react-router-dom';


import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button, Container } from 'react-bootstrap';

import { useContext } from 'react';

import UserContext from '../UserContext';
import { fontWeight } from '@mui/system';


export default function AppNavbar({ clickOutCount, cartLength }) {

    const { user, handleShowCart } = useContext(UserContext);

    const [expanded, setExpanded] = useState(false);

    const style = {
        color: '#0a4678',
        fontWeight: 'bold'
    }


    useEffect(() => {
        setExpanded(false);
    }, [clickOutCount])

    function handleLinkClick() {
        setExpanded(false);
    }

    const cartIcon = <p className="position-relative m-0">
            &#128722;
        <span className="position-absolute translate-middle badge rounded-pill" style={{ fontSize: '.8rem', backgroundColor: 'rgba(255,0,0,0.5)', left: '30px', top: '5px' }}>
            {cartLength}
        </span>
    </p>

    return (
        <Navbar expand="lg" style={{ background: '#FFEBAD' }} expanded={expanded}>
            <Container>
                <Navbar.Brand onClick={handleLinkClick} style={style} as={Link} to="/">&nbsp;Rico Mart</Navbar.Brand>

                {(user.isAdmin == false) ?
                    <>
                        <Navbar.Brand className="d-inline d-lg-none" onClick={e => {
                            handleShowCart();
                            handleLinkClick();
                        }} style={{ cursor: 'pointer' }}>
                            {cartIcon}
                        </Navbar.Brand>
                    </>
                    :
                    ''

                }

                {(user.id == null) ?
                    <>
                        <Nav.Link as={NavLink} to="/login" className="text-success d-lg-none">&nbsp;<strong>Login</strong></Nav.Link>

                        <Nav.Link as={NavLink} to="/register" className="text-info d-lg-none">&nbsp;<strong>Register</strong></Nav.Link>
                    </>
                    :

                    ''

                }

                <Navbar.Toggle onClick={e => {
                    setExpanded(!expanded);
                }} aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-between">
                    <Nav className="me-auto">
                        <Nav.Link onClick={handleLinkClick} as={NavLink} to="/">&nbsp;<strong>Home</strong></Nav.Link>
                        <Nav.Link onClick={handleLinkClick} as={NavLink} to={`/products?field=name&isAsc=1`}>&nbsp;<strong>Products</strong></Nav.Link>

                        {(user.isAdmin)
                            &&

                            <Nav.Link onClick={handleLinkClick} as={NavLink} to="/admin/dashboard">&nbsp;<strong>Admin</strong></Nav.Link>

                        }

                    </Nav>


                    <Nav>

                        {(user.isAdmin === false)
                            ?
                            <>
                                <Navbar.Brand className="d-none d-lg-inline" onClick={handleShowCart} style={{ cursor: 'pointer' }}>{cartIcon}</Navbar.Brand>

                                <Navbar.Brand onClick={handleLinkClick} as={Link} to={'/orders'}>&nbsp;Orders</Navbar.Brand>
                            </>
                            :
                            ''
                        }

                        {(user.isAdmin === true)
                            ?
                            <>
                                <Navbar.Brand as={Link} to={'/admin/orders'} onClick={handleLinkClick}>&nbsp;User Orders</Navbar.Brand>

                            </>
                            :
                            ''

                        }

                        {(user.isSuperAdmin === true)
                            ?
                            <Navbar.Brand onClick={handleLinkClick} as={Link} to={'/admin/users'}>&nbsp;Users</Navbar.Brand>
                            :
                            ''

                        }
                        {(user.id !== null)
                            ?
                            <div className="d-flex justify-content-end">
                                <Nav.Link onClick={handleLinkClick} as={NavLink} to="/logout" className="text-end text-danger">&nbsp; <strong>Logout</strong></Nav.Link>
                            </div>
                            :
                            <>
                                <Nav.Link as={NavLink} to="/login" className="text-success d-none d-lg-inline">&nbsp;<strong>Login</strong></Nav.Link>
                                <Nav.Link as={NavLink} to="/register" className="text-info d-none d-lg-inline">&nbsp;<strong>Register</strong></Nav.Link>
                            </>
                        }
                    </Nav>



                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

