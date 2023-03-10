
import {useState, useEffect, useContext} from 'react';
import { Form, Button, FloatingLabel, Col, Row } from 'react-bootstrap';

import Auth from '../layout/Auth';

import {Navigate, Link, useSearchParams, useNavigate } from 'react-router-dom';

import UserContext from '../UserContext';

import Swal from 'sweetalert2';

import Spinner from '../utils/Spinner';

export default function Login() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const {user, setUser, setCart, setCartValue} = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [pswd, setPswd] = useState("");

    const [isActive, setIsActive] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    function authenticate(e) {
        e.preventDefault();

        setIsLoading(true);


        fetch(`/users/login`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: pswd
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            if (typeof data.access !== "undefined") {
                localStorage.setItem('token', data.access);

                retrieveUserDetails(data.access);

                
                // Swal.fire({
                //     title: "Login Successful",
                //     icon: "success",
                //     text: "Welcome to Ricomart!"
                // })                    
                

                
            } else {
                setIsLoading(false);
                Swal.fire({
                    title: "Authentication Failed",
                    icon: "error",
                    text: "Please, check your login details and try again."
                })
                
            }
        });

        // localStorage.setItem('email', email);

        // setUser({email: localStorage.getItem('email')})



        setEmail("");
        setPswd("");
        // alert(`${email} has been authenticated. Thank you for logging in.`);
        console.log("Logged in");

    }

    const retrieveUserDetails = (token) => {
        setIsLoading(true);
        fetch(`/users/details`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            setUser({
                email: data.email,
                id: data._id,
                isAdmin: data.isAdmin,
                isSuperAdmin: data.isSuperAdmin
            })

            setCart(data.cart);
            setCartValue(data.cartValue);


            const viewSearchParam = searchParams.get('view');
            if (viewSearchParam !== null) {
                navigate(`/products/${viewSearchParam}`);
            }

            setIsLoading(false);
        })
    }

    useEffect(() => {

        if (pswd === "" || email.length === "") {
            setIsActive(false);
            return;
        }

        setIsActive(true);



    },[email, pswd])

    const registerLink = 
        (searchParams.get('view') !== null)
        ?   `/register?view=${searchParams.get('view')}`
        : '/register'
    
    


    return (
        (user.id !== null) 
        ?

        <Navigate to="/products" />

        :
        
        (isLoading) ?

        <Auth>
            <Spinner />
        </Auth>
        :
        <Auth>
        <Form onSubmit={(e) => authenticate(e)}>
        <h1 className="text-center mb-4">Login</h1>
            <Form.Group  controlId="userEmail">

                <FloatingLabel
                controlId="userEmail"
                label="Email address"
                className="mb-3"
                >

                    <Form.Control 
                        type="email" 
                        placeholder="Enter email" 
                        required
                        value={email}
                        onChange={e => {
                            setEmail(e.target.value);
                        }}
                    />
                </FloatingLabel>
            </Form.Group>

            <Form.Group controlId="password1">
            <FloatingLabel
                controlId="password1"
                label="Password"
                className="mb-3"
                >

                    <Form.Control 
                        type="password" 
                        placeholder="Password" 
                        required
                        value={pswd}
                        onChange={e => {
                            setPswd(e.target.value);
                        }}
                    />
                </FloatingLabel>
            </Form.Group>

            <Link to={registerLink}>Not yet registered?</Link>

            <div className="mt-3 text-center">
                <Button variant="success" type="submit" id="submitBtn" 
                disabled={!isActive}
                >
                    Login
                </Button>
            </div>
        </Form>
        </Auth>

    )
}