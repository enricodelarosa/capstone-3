import {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';

import AppNavbar from './components/AppNavbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import Products from './pages/Products';
import ProductView from './pages/ProductView';
import Admin from './pages/Admin/Admin';
import AddProduct from './pages/Admin/AddProduct';
import Error404 from './pages/Error404';

import Cart from './components/Cart';
import Offcanvas from 'react-bootstrap/Offcanvas';

import {UserProvider} from './UserContext';

import {Container, Button} from 'react-bootstrap';

import Content from './layout/Auth';

import useWindowDimensions from './utils/WindowDimensions';

import './App.css';

function App() {
    const [showCart, setShowCart] = useState(false);

    const handleCloseCart = () => setShowCart(false);
    const handleShowCart = () => setShowCart(true); 

    const { height, width } = useWindowDimensions();

    console.log(height);

    const [user, setUser] = useState({
        id: null,
        isAdmin: null
    });

    const [cart, setCart] = useState([]);
    const [cartValue, setCartValue] = useState(0);

    const refreshCart = () => {
        console.log('refreshing cart, getting details');
        fetch(`/users/details`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
    
            if(typeof data._id !== "undefined") {
    
                setCart(data.cart);
                setCartValue(data.cartValue);
            } 
    
            else { 

                setCart([]);
                setCartValue(0);
            }
    
        })

    }

    const unsetUser = () => {
        localStorage.clear();
        setUser({
            id: null,
            isAdmin: null
        });

        setCart([]);
        setCartValue(0);
    }

    useEffect(() => {
        fetch(`/users/details`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
    
            if(typeof data._id !== "undefined") {
    
                setUser({
                    id: data._id,
                    isAdmin: data.isAdmin,
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

    function toDisplayAmt(amount) {
        return Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            }).format(amount)
    }

  return (
    <UserProvider value={{user, setUser, unsetUser, cart, setCart, setCartValue, refreshCart, handleShowCart, setShowCart}}>
    <Router>

    { (user.isAdmin === false) ?
    <Offcanvas show={showCart} onHide={handleCloseCart}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Cart</Offcanvas.Title>
          <Offcanvas.Title>&#8369; {toDisplayAmt(cartValue)}</Offcanvas.Title>
          <div>
            <Button>Checkout</Button>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body>
            <Cart cart={cart}/>
        </Offcanvas.Body>

      </Offcanvas>

      :

      ''

    }

      <AppNavbar id="navbar"/>
      <Container className="content-container" style={{height: height - 48 + 'px'}}>
            <Routes>
            <Route path="/" element={<Navigate to="/products"/>} />
            <Route path="/products" element={<Products />} />

            <Route path="/products/:productId" element={<ProductView />} />

            {/* conditionally provide admin routes for better security */}
            {(user.isAdmin === true)
                ?
                <>
                <Route path="/admin/dashboard" element={<Admin />}/>

                <Route path="/admin/products/new" element={<AddProduct header={'Create Product'}/>}/>

                <Route path="/admin/products/:productId" element={<AddProduct header={'Edit Product'}/>}/>
                </>
                :
                
                ''

            }


            <Route path="/register" element={<Register />}/>
            <Route path = "/login" element={<Login />}/>
            <Route path = "/logout" element={<Logout/>}/>

            <Route path = "/*" element={<Error404/>}/>
            
            </Routes>
      </Container>
    </Router>
    </UserProvider>
  );
}

export default App;
