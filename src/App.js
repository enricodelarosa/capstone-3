import { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';

import AppNavbar from './components/AppNavbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import Products from './pages/Products';
import ProductView from './pages/ProductView';
import Account from './pages/Account';

import Error404 from './pages/Error404';
import Orders from './pages/Orders/Orders';

import Admin from './pages/Admin/Dashboard/Admin';
import AddProduct from './pages/Admin/AddProduct';
import AdminOrders from './pages/Admin/AdminOrders'
import Users from './pages/Admin/Users/Users';

import Cart from './components/Cart';
import Offcanvas from 'react-bootstrap/Offcanvas';

import { UserProvider } from './UserContext';

import { Container, Button } from 'react-bootstrap';

import Content from './layout/Auth';

import Spinner from './utils/Spinner';

import Swal from 'sweetalert2';

import useWindowDimensions from './utils/WindowDimensions';

import './App.css';

function App() {
    const { height, width } = useWindowDimensions();
    const navigate = useNavigate();

    //start of for click outside
    const [clickOutCount, setClickOutCount] = useState(0);

    const handleClickOutsideNavBar = () => {
        setClickOutCount(clickOutCount + 1);
    };

    const [isNavHidden, setIsNavHidden] = useState(false);

    const [scrollPosition, setSrollPosition] = useState(0);

    const [lastScroll, setLastScroll] = useState(0);

    const handleScroll = () => {
        const position = window.pageYOffset;
        console.log(position);
        setSrollPosition(position);
    };
    
    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
    
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {

        if (width < 768) {
            if (lastScroll < scrollPosition) {
                //scrolldown
                setIsNavHidden(true);
            } else if (lastScroll > scrollPosition) {
                setIsNavHidden(false);
            }
            setLastScroll(scrollPosition);

        } else {
            setIsNavHidden(false);
        }

    },[scrollPosition, width])


    //end of for click outside

    const [ischeckoutLoading, setIsCheckoutLoading] = useState(false);
    const [isCartLoading, setIsCartLoading] = useState(false)

    const [isCheckoutButtonDisabled, setIsCheckoutButtonDisabled] = useState(false);

    const [showCart, setShowCart] = useState(false);

    const [orderDum, setOrderDum] = useState(0);

    const handleCloseCart = () => setShowCart(false);
    const handleShowCart = () => setShowCart(true);

    

    const [user, setUser] = useState({
        id: 0,
        isAdmin: null
    });

    const [cart, setCart] = useState(null);
    const [cartValue, setCartValue] = useState(0);

    const refreshCart = (optionalCallBackFunc) => {

        console.log('refreshing cart, getting details');
        fetch(`/users/details`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {

                if (typeof data._id !== "undefined") {

                    setCart(data.cart);
                    setCartValue(data.cartValue);
                }

                else {

                    setCart(null);
                    setCartValue(0);
                }

                setIsCartLoading(false);


                


                let isFunction = typeof optionalCallBackFunc === 'function'

                if (isFunction) {

                    optionalCallBackFunc();
                }



            })



    }

    const unsetUser = () => {
        localStorage.clear();
        setUser({
            id: null,
            isAdmin: null,
            isSuperAdmin: null
        });

        setCart([]);
        setCartValue(0);
    }

    useEffect(() => {
        setUser({
            id: 0,
            isAdmin: null
        });
        document.body.setAttribute('style', 'background: #C3F8FF;')
        fetch(`/users/details`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(res => res.json())
            .then(data => {

                if (typeof data._id !== "undefined") {

                    setUser({
                        email: data.email,
                        id: data._id,
                        isAdmin: data.isAdmin,
                        isSuperAdmin: data.isSuperAdmin
                    })

                    setCart(data.cart);
                    setCartValue(data.cartValue);
                }

                else {
                    setUser({
                        id: null,
                        isAdmin: null
                    })

                    setCart([]);
                    setCartValue(0);
                }

            })
    }, []);

    useEffect(() => {
        if (cart !== null) {
            if (cart.length === 0) {
                setIsCheckoutButtonDisabled(true);
            } else {
                setIsCheckoutButtonDisabled(false);
            }

            // console.log(typeof cart.find(cartItem => {
            //     return cartItem.isActive == false
            // }))

            if (typeof cart.find(cartItem => {
                return cartItem.isActive == false
            }) === 'undefined') {
                setIsCheckoutButtonDisabled(false);
            } else {
                setIsCheckoutButtonDisabled(true);
            }

        }

    }, [cart])

    function toDisplayAmt(amount) {
        return Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount)
    }

    function handleCheckout() {
        setIsCheckoutLoading(true);
        fetch(`/users/cart/checkout`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);

                if (data.success === true) {
                    Swal.fire({
                        title: `Order #${data.orderId} Placed`,
                        icon: "success",
                        text: "Order has been placed."
                    })

                    refreshCart(() => {
                        setIsCheckoutLoading(false);
                    });

                    navigate('/orders');
                    setOrderDum(orderDum + 1);




                } else {
                    Swal.fire({
                        title: data.errorHeading,
                        icon: "error",
                        text: data.errorMessage
                    })

                }

            })

    }





    return (
        <UserProvider value={{ user, setUser, unsetUser, cart, setCart, setCartValue, refreshCart, handleShowCart, setShowCart, orderDum, setIsCartLoading, setIsCheckoutLoading, setIsCheckoutButtonDisabled, width}}>


            {(user.isAdmin === false) ?
                <Offcanvas show={showCart} onHide={handleCloseCart}>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Cart</Offcanvas.Title>


                        <Offcanvas.Title>&#8369; {toDisplayAmt(cartValue)}</Offcanvas.Title>
                        <div>
                            {(ischeckoutLoading) ?
                                <Spinner small={true} />
                                :
                                <Button onClick={handleCheckout} disabled={isCheckoutButtonDisabled}>Checkout</Button>
                            }

                        </div>
                    </Offcanvas.Header>

                    {
                        (isCartLoading) ?
                            <Spinner />
                            :
                            <Offcanvas.Body>
                                <Cart cart={cart} />
                            </Offcanvas.Body>

                    }
                </Offcanvas>

                :

                ''

            }

            <AppNavbar isHidden={isNavHidden} clickOutCount={clickOutCount} id="navbar" cartLength={(cart == null? 0 : cart.length)}/>


            <Container id="container-content-body" onClick={handleClickOutsideNavBar} className="content-container" style={{ height: height - 48 + 'px' }}>

                {(user.id === 0) ?

                <Content>
                    <Spinner />
                </Content>
                    :

                    <Routes>
                        <Route path="/" element={<Navigate to="/products" />} />
                        <Route path="/app" element={<Navigate to="/products" />} />
                        <Route path="/products" element={<Products />} />

                        <Route path="/products/:productId" element={<ProductView />} />

                        {/* conditionally provide admin routes for better security */}
                        {(user.isAdmin === true)
                            ?
                            <>
                                <Route path="/admin/dashboard" element={<Admin />} />

                                <Route path="/admin/products/new" element={<AddProduct header={'Create Product'} />} />

                                <Route path="/admin/products/:productId" element={<AddProduct header={'Edit Product'} />} />

                                <Route path="/admin/orders" element={<AdminOrders />} />
                            </>
                            :

                            ''

                        }


                        {(user.isSuperAdmin === true)
                            ?
                            <Route path="/admin/users" element={<Users />} />

                            :
                            ''
                        }

                        {(user.isAdmin === false)
                            ?
                            <>
                                <Route path="/orders" element={<Orders />} />
                            </>
                            :

                            ''

                        }


                        <Route path="/account" element={<Account />} />


                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/logout" element={<Logout />} />

                        <Route path="/*" element={<Error404 />} />

                    </Routes>

                }

            </Container>
            {/* </Router> */}
        </UserProvider>
    );
}

export default App;
