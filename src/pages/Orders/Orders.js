import {useState, useEffect, useContext} from 'react';

import {Container, Button, Row, Col} from 'react-bootstrap';

import UserContext from '../../UserContext';

import '../../css/Orders.css'

import Spinner from '../../utils/Spinner';

import { useNavigate } from 'react-router-dom';

export default function Orders() {

    const navigate = useNavigate();    
    const {setShowCart, orderDum} = useContext(UserContext);

    const [orders, setOrders] = useState(null);

    useEffect(() => {
        fetch(`/users/orders`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            setOrders(data);

        })


    },[orderDum])

    function amtDisplay(amt) {
        return Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            }).format(amt)
    }

    function dtDisplay(isoFormat) {
        const date = new Date(isoFormat);
        return date.toLocaleString();
    }

    return (
        <Container className="mt-4 pb-4">
            <h1 className="text-center">Orders</h1>
            
            {(orders == null) ?
                <Spinner />

                :

                (orders.length === 0) ?
                <p className="text-center">No orders yet. Start by adding items to your <p className="text-info pointer d-inline" onClick={e => {
                    setShowCart(true);
                }}>cart</p></p>
                :

                orders.map(order => {
                    return (
                        <Row key={order.orderId} className="border border-dark my-4 rounded justify-content-center" style={{backgroundColor: '#ABD9FF'}}>
                            <h2 className="text-center">Order #{order.orderId}</h2>
                            <h5 className="text-center">Order Total: &#8369; {amtDisplay(order.totalAmount)}</h5>
                            <h6 className="text-center">{dtDisplay(order.purchasedOn)}</h6>
                            {
                                order.orderItems.map(orderItem => {
                                    return (
                                        <Col style={{backgroundColor: '#FFF6BF'}}
                                        key={orderItem._id} className="border border-info px-3 py-2 my-2 rounded col-10 col-md-4 col-lg-2 m-2">
                                            <span className="text-center d-block mb-2">Order Item # {orderItem._id}</span>

                                            <h4 className="pointer text-primary" onClick={e => {
                                                navigate(`/products/${orderItem.productId}`)
                                            }}>{orderItem.name}</h4>
                                            <h6>Price: &#8369; {amtDisplay(orderItem.unitPrice)}</h6>
                                            <h6>Qty: {orderItem.quantity}</h6>
                                            <h5>Total: &#8369; {amtDisplay(orderItem.subTotal)}</h5>
                                            <h6>Status: For Packing</h6>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    )
                })
            }

        </Container>
    )
}