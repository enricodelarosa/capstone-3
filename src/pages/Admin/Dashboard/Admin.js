import {useState, useEffect, useContext} from 'react';
import {Row, Col,  Button} from 'react-bootstrap';

import { Link} from 'react-router-dom';

import Table from 'react-bootstrap/Table';

import Spinner from '../../../utils/Spinner';


import AdminProduct from './AdminProduct';

import UserContext from '../../../UserContext';

export default function Admin() {
    // Get all products
    const {width} = useContext(UserContext);


    const [products, setProducts] = useState(null);

    const headers = [{name: 'Name'}, {description: 'Description'}, {price: 'Price'}, {stock: 'Stock'}, {isActive: 'Availability'}, {actions: 'Actions'}]


    function getProducts(callbackFunc) {
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
            
            if (typeof callbackFunc === 'function') {
                callbackFunc(false);
            }
            

            //setProducts
        })
    }

    useEffect(()=> {
        getProducts();

    },[])

    const bigHeaders = headers.map(header => {
                        

        return <th key={Object.values(header)[0]}>{Object.values(header)[0]}</th>;
    })

    const smallHeaders = headers.slice(0, 1).concat(headers.slice(2,3), headers.slice(4)).map(header => {
                        

        return <th key={Object.values(header)[0]}>{Object.values(header)[0]}</th>;
    })

    

    return (
        <>
            <Row className="m-4 justify-content-center">
                <h1 className="text-center">Admin Dashboard</h1>
                    <Col className="text-center col-4 col-md-2">
                
                            <Button as={Link} to={'/admin/products/new'}>
                                Add New Product
                            </Button>
                    </Col>

                    {/* <Col className="text-center col-4 col-md-2">
                <Button as={Link} to={'/admin/orders'} variant="success">
                    Show User Orders
                </Button>
        
            </Col> */}
            </Row>
        {(products == null) ?
            <>

            <Spinner />
            </>
            :
            <>
            
        
        <Row>
        <Table style={{overflowWrap: 'anywhere'}}variant="dark" striped bordered hover responsive>
            <thead>
                <tr className="text-center">
                    {(width <= 768) ? smallHeaders: bigHeaders}
                </tr>
            </thead>
            <tbody>
                {products.map(product => {
                    return (

                        <AdminProduct key={product._id} product={product} getProducts={getProducts}/>
                    )
                })}
            </tbody>
        </Table>

        </Row>
        </>

        }
        

        </>
    )
}