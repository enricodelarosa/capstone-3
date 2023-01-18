import {useState, useEffect, useContext} from 'react';
import {Row, Col,  Button} from 'react-bootstrap';

import {useParams, useNavigate, Link} from 'react-router-dom';

import Table from 'react-bootstrap/Table';

export default function Admin() {
    // Get all products

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const headers = [{name: 'Name'}, {description: 'Description'}, {price: 'Price'}, {stock: 'Stock'}, {isActive: 'Availability'}, {actions: 'Actions'}]


    function getProducts() {
        fetch(`/products/all`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            setProducts(data);

            //setProducts
        })
    }

    useEffect(()=> {
        getProducts();

    },[])

    function toggleisActive(productId, option) {
        fetch(`/products/${productId}/${option}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => res.json())
        .then(data => {

            getProducts();
            //setProducts
        })

    }

    return (
        <>
        <Row className="m-4 justify-content-center">
            <h1 className="text-center">Admin Dashboard</h1>
            <Col className="text-center col-4 col-md-2">
        
                    <Button as={Link} to={'/admin/products/new'}>
                        Add New Product
                    </Button>
            </Col>

            <Col className="text-center col-4 col-md-2">
                <Button as={Link} to={'/admin/orders'} variant="success">
                    Show User Orders
                </Button>
        
            </Col>
        </Row>
        
        <Row>
        <Table striped bordered hover responsive>
            <thead>
                <tr className="text-center">
                    {headers.map(header => {
                        return <th>{Object.values(header)[0]}</th>;
                    })}
                </tr>
            </thead>
            <tbody>
                {products.map(product => {
                    return (
                        <tr className={`${product.isActive ? '' : 'bg-danger'} align-middle`}>
                            <th>{product.name}</th>
                            <td>{product.description}</td>
                            <td className="text-end">&#8369;  { 
                                            Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                            }).format(product.price)
                                            }
                            </td>
                            <td  className="text-center">{product.stock}</td>
                            <td className={`text-center`}>
                                <strong>
                                    {
                                        product.isActive ? 'Active' : 'Inactive'
                                    }
                                </strong>
                            </td>
                            <td className="text-center">
                                <Button className="my-1 py-0 px-2 d-block mx-auto" onClick={e => {
                                    navigate(`/admin/products/${product._id}`)
                                }}>Update</Button>

                                <Button className="my-1 py-0 px-2 d-block mx-auto"
                                onClick={e => {
                                    const option = product.isActive ? 'deactivate' : 'activate';
                                    toggleisActive(product._id, option)
                                }}
                                >     
                                    {product.isActive ? 'Deactivate' : 'Activate'}
                                </Button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>

        </Row>

        </>
    )
}