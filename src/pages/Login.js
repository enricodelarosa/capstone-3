
import {useState, useEffect, useContext} from 'react';
import { Form, Button, FloatingLabel, Col, Row } from 'react-bootstrap';

import {Navigate} from 'react-router-dom';

import UserContext from '../UserContext';

import Swal from 'sweetalert2';

export default function Login() {
    const {user, setUser} = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [pswd, setPswd] = useState("");

    const [isActive, setIsActive] = useState(false);

    function authenticate(e) {
        e.preventDefault();

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

                Swal.fire({
                    title: "Login Successful",
                    icon: "success",
                    text: "Welcome to Zuitt!"
                })                    
                

                
            } else {

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
                isAdmin: data.isAdmin
            })
        })
    }

    useEffect(() => {

        if (pswd === "" || email.length === "") {
            setIsActive(false);
            return;
        }

        setIsActive(true);



    },[email, pswd])


    return (
        (user.id !== null) 
        ?
        
        <Navigate to="/products" />

        :
        <Col className="h-100">
        <Row className="col-12 col-md-4 h-100 mx-auto d-flex align-items-center justify-content-center">
        
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

            <div className="mt-3 text-center">
                <Button variant="success" type="submit" id="submitBtn" 
                disabled={!isActive}
                >
                    Login
                </Button>
            </div>
        </Form>
        </Row>
        </Col>

    )
}