import {useState, useEffect, useContext} from 'react';
import { Form, Button, FloatingLabel, Col, Row } from 'react-bootstrap';

import {Navigate, useNavigate, Link} from 'react-router-dom';

import UserContext from '../UserContext';

import Swal from 'sweetalert2';

import Auth from '../layout/Auth';

import Spinner from '../utils/Spinner';


export default function Register() {

    const {user, setUser, setCart, setCartValue} = useContext(UserContext);

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [pswd, setPswd] = useState("");
    const [verifyPswd, setVerifyPswd] = useState("");

    const [isActive, setIsActive] = useState(false);

    function ValidateEmail(email) {

        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if (email.match(validRegex)) {
      
          return true;
      
        } else {
      
          return false;
      
        }
      
      }

    function loginUser() {
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

                setIsLoading(false);                 
                

                
            } else {

                
            }
        });

    }

        const retrieveUserDetails = (token) => {
        fetch(`/users/details`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            setUser({
                id: data._id,
                isAdmin: data.isAdmin,
                isSuperAdmin: data.isSuperAdmin
            })

            setCart(data.cart);
            setCartValue(data.cartValue);
        })
    }

    function registerUser(e) {
        e.preventDefault();

        setIsLoading(true);
        setEmail("");
        setPswd("");
        setVerifyPswd("");

        fetch(`/users/register`,
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
            if (data) {

                setIsLoading(false);
                loginUser();
                Swal.fire({
                    title: "Registration Successful",
                    icon: "success",
                    text: "Welcome to Rico Mart! You've been automatically logged in!"
                })    

                navigate('/login');


            } else {
                Swal.fire({
                    title: "Email Already Registered",
                    icon: "error",
                    text: "Please log-in"
                })   

                navigate('/login');

            }
        });


        // alert("Thank you for registering");
        console.log("registered");


    }

    useEffect(() => {

        if (pswd.length <= 0 || verifyPswd.length <= 0 || email.length <= 0) {
            return;
        }

        if (pswd === verifyPswd && ValidateEmail(email) === true) {
            setIsActive(true);
            return
        }
        
        setIsActive(false);

    },[email, pswd, verifyPswd])


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
        <Form className="mx-auto p-0" onSubmit={(e) => registerUser(e)}>
        <h1 className="text-center mb-4">Register</h1>
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
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                </Form.Text>
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

            <Form.Group controlId="password2">
                <FloatingLabel
                controlId="password2"
                label="Vefify Password"
                className="mb-3">
                    <Form.Control 
                        type="password" 
                        placeholder="Verify Password" 
                        required
                        value={verifyPswd}
                        onChange={e => {
                            setVerifyPswd(e.target.value);
                        }}
                    />
                </FloatingLabel>
            </Form.Group>

            <Link to={'/login'}>Already registered?</Link>
            
            <div className="mt-4 text-center">
                <Button variant={isActive ? 'primary' : 'danger'} type="submit" id="submitBtn" 
                disabled={!isActive}
                >
                    Register
                </Button>
            </div>
        </Form>
        </Auth>
    )

}