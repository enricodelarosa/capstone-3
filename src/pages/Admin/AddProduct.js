import Auth from '../../layout/Auth';

import { Form, Button, FloatingLabel, Col, Row} from 'react-bootstrap';

import {Link} from 'react-router-dom'

import * as React from 'react';
import {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import Swal from 'sweetalert2';

import Spinner from '../../utils/Spinner';


export default function AddProduct({header, data}) {

    const navigate = useNavigate();

    const {productId} = useParams('productId');

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(1);
    const [stock, setStock] = useState(0);

    const [isActive, setIsActive] = useState(false);

    const [isCreateActive, setIsCreateActive] = useState(false)

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!productId) {
            console.log('productId is blank')
            return;
        }

        setIsLoading(true);
        fetch(`/products/${productId}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            const {name, description, price, stock, isActive} = data.product;
 
            setName(name);
            setDescription(description);
            setPrice(price);
            setStock(stock ? stock : 1);
            setIsActive(isActive);
            setIsLoading(false);
        })


    }, [])


    useEffect(() => {
        if (name.length <= 0 || description.length <= 0 || price <= 0 || stock < 0) {
            setIsCreateActive(false);
            return;
        }

        setIsCreateActive(true);

    },[name, description, price, stock, isActive])

    useEffect(() => {
        if (isActive === true && stock === 0) {
            
            Swal.fire({
                title: "Products with 0 stock cannot be active",
                icon: "error",
                text: "Please set stock to a number greater than 0."
            })                    
            
        }


        if (stock === 0) {
            setIsActive(false);
        }
    },[stock, isActive])

    function handleIsActiveToggle(state) {

        setIsActive(!state);
    }

    function handlePrice(e) {
        if (e.target.value <= 0) {
            return;
        }
        
        const hasDecimalPlaces = e.target.value.toString().includes('.');

        if (hasDecimalPlaces) {
            const decimalPlaces = e.target.value.toString().split('.')[1].length;


            if (decimalPlaces > 2) {
                return;
            }
        }

        setPrice(Number(e.target.value));
    }

    function handleStock(e) {
        if (e.target.value < 0 || e.target.value.length == 0) {
            return;
        }


        if (e.target.value.toString().includes('.')) {
            setStock(Number(Math.trunc(e.target.value)))
            return;
        }

        setStock(Number(e.target.value));
    }

    function createProduct() {
        fetch(`/products`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                name,
                description,
                price,
                stock,
                isActive
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            if (data.success === true) {


                Swal.fire({
                    title: "Product Created",
                    icon: "success",
                    text: "Product creation successfull!"
                })        
                
                navigate(`/products/${data.id}`)
                

                
            } else {

                Swal.fire({
                    title: "Product Not Created",
                    icon: "error",
                    text: "Error encountered. Please Try again."
                })
                
            }
        });

    }

    function editProduct() {
        fetch(`/products/${productId}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                name,
                description,
                price,
                stock,
                isActive
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            if (data.success === true) {


                Swal.fire({
                    title: "Product Updated",
                    icon: "success",
                    text: "Product update successfull!"
                })        
                
                navigate(`/products/${data.id}`)
                

                
            } else {

                Swal.fire({
                    title: "Product Not Updated",
                    icon: "error",
                    text: "Error encountered. Please Try again."
                })
                
            }
        });

    }

     
    return (
        <Auth>
            <Form className="mt-12 mt-md-0">
                <h1 className="text-center mb-4">{header}</h1>

                {(isLoading) ? 
                <Spinner />
                :
                <>
                <Form.Group  controlId="name">

                    <FloatingLabel
                    controlId="name"
                    label="Product Name"
                    className="mb-3"
                    >

                        <Form.Control 
                            type="text" 
                            required
                            placeholder=" "
                            value={name}
                            onChange={e => {
                                setName(e.target.value)
                            }}
                        />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group  controlId="description">
                    <FloatingLabel
                    controlId="description"
                    label="Description"
                    className="mb-3"
                    >

                        <Form.Control 
                            as="textarea"
                            style={{height: '150px'}}
                            required
                            placeholder=" "
                            value={description}
                            onChange={e => {
                                setDescription(e.target.value)
                            }}
                        />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group  controlId="price">

                    <FloatingLabel
                    controlId="price"
                    label="Price"
                    className="mb-3"
                    >

                        <Form.Control 
                            type="number" 
                            required
                            placeholder=" "
                            value={price}
                            onChange={handlePrice}
                            step=".01"
                        />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group  controlId="stock">

                    <FloatingLabel
                    controlId="stock"
                    label="Stock"
                    className="mb-3"
                    >

                        <Form.Control 
                            type="number" 
                            required
                            placeholder=" "
                            value={stock}
                            onChange={handleStock}
                        />
                    </FloatingLabel>
                </Form.Group>

                <h6>Set Product As</h6>
                <FormGroup onClick={e => {
                    handleIsActiveToggle(isActive);
                }}>
                    <FormControlLabel 
                    control={
                        <Switch
                        checked={isActive}
                        onChange={e => {
                            handleIsActiveToggle(isActive)
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                        } 
                        
                    label={isActive ? 'Active' : 'Inactive'} 
                    />

                </FormGroup>
                <div className="text-center mt-4 position-relative">
                <Button disabled={!isCreateActive} onClick={e => {
                    if (productId) {
                        editProduct();
                        return
                    }

                    createProduct();
                }}>
                    {productId ? 'Edit Product' : 'Create Product'}
                </Button>


                <Button as={Link} to="/admin/dashboard" className="position-absolute end-0 text-dark" variant="warning">
                    Cancel  
                </Button>
                </div>
                </>
                }
                
                





            </Form>

            
        </Auth>
    )
}