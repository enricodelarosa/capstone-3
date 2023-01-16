import {useState, useEffect, useContext} from 'react';
import { Form, Button, FloatingLabel, Col, Row } from 'react-bootstrap';

import {Navigate, useNavigate} from 'react-router-dom';

import UserContext from '../UserContext';

import Swal from 'sweetalert2';


export default function Register() {

    const navigate = useNavigate();


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

    function registerUser(e) {
        e.preventDefault();
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

                Swal.fire({
                    title: "Registration Successful",
                    icon: "success",
                    text: "Welcome to Zuitt! Kindly log-in using your newly registered account"
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

    const {user} = useContext(UserContext);

    return (
        (user.id !== null) 
        ?
        <Navigate to="/courses" />

        :
        <Col className="h-100">
        <Row className="col-12 col-md-4 h-100 mx-auto d-flex align-items-center justify-content-center">
        
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
            
            <div className="mt-4 text-center">
                <Button variant={isActive ? 'primary' : 'danger'} type="submit" id="submitBtn" 
                disabled={!isActive}
                >
                    Register
                </Button>
            </div>
        </Form>

        </Row>
        </Col>
    )

}