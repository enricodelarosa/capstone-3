import {useEffect, useState} from 'react';

import Spinner from '../../utils/Spinner';

import {Container, Row} from 'react-bootstrap';

import '../../css/AdminOrders.css';

import {displayAmt} from '../../utils/display';


import AdminOrder from './AdminOrder';
import Content from '../../layout/Content';

export default function AdminOrders() 
{
    const [users, setUsers] = useState(null);

    console.log(users == null);

    useEffect(()=> {
        fetch(`/orders?isDetailed=1`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            setUsers(data);

        })
    },[])

    function getTotal(orders) {
        return orders.reduce((total, order) => {
            return total + Number(order.totalAmount)
        }, 0);
    }

    function getAverageUniqueItemsPerBasket(orders) {
        const totalOfUniqueProductsPerBasket = orders.reduce((total, order) => {
            return total + Number(order.orderItems.length);
        }, 0) 


        const orderCount =  orders.length;

        const answer = totalOfUniqueProductsPerBasket / orderCount;

        return answer.toFixed(2);


    }

    function getAverageBasketSize(orders) {
        const total = getTotal(orders);
        
        return total / orders.length;
    }

     return (
        <>
        <h1 className="text-center mt-4">Users' Orders</h1>

        {users == null
        ?
            <Content>
                <Spinner />
            </Content>
        

        :
        <Container>
            {
                users.map(user => {
                    return (
                        <Row style={{backgroundColor: 'white'}} className="border border-dark rounded py-2 my-4 justify-content-center" key={user.userId}>
                            <h3 className="text-center">User: {user.email}</h3>
                            <div style={{width: 'fit-content'}} className="my-2 d-flex">
                                <div>
                                    <h6>Accumulated Orders Amount:</h6>
                                    <h6>Number of Orders:</h6>
                                    <h6>Average Basket Value:</h6>
                                    <h6>Avg Unique Products /Basket:</h6>
                                </div>

                                <div>
                                    <h6 className="text-end"> &#8369; {displayAmt(getTotal(user.orders)) }
                                    </h6>
                                    <h6 className="text-center">{user.orders.length}</h6>

                                    <h6 className="text-end"> &#8369; {displayAmt(getAverageBasketSize(user.orders))}</h6>

                                    <h6 className="text-center">{getAverageUniqueItemsPerBasket(user.orders)}</h6>
                                </div>
                            </div>
                            <Container>
                                <Row className="justify-content-center">
                                    {
                                        user.orders.map(order => {
                                            return (
                                                <AdminOrder 
                                                order={order} key={order.orderId}/>
                                            )
                                        })
                                    }
                                </Row>
                            </Container>
                        </Row>
                    )
                })
            }
        </Container>
        }
        </>
    )

}