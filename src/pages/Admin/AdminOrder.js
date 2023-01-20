import {useState} from 'react';

import AdminOrderItem from './AdminOrderItem';

import {Col} from 'react-bootstrap';

import { displayAmt, dtDisplay } from '../../utils/display';

export default function AdminOrder({order}) {

    const [showOrderItems, setShowOrderItems] = useState(false);

    return (

        <Col className="border border-dark rounded m-2 col-11 col-md-3 col-lg-2" style={{backgroundColor: '#ABD9FF'}}
        onClick={e=> {
            setShowOrderItems(!showOrderItems);
        }}
        >
            <div>
                <h6 className="d-inline">Order Id: </h6><span>{order.orderId}</span>
            </div>

            <div>
                <span className="d-inline">{dtDisplay(order.purchasedOn)}</span>
            </div>

            <div>
                <h6># of Products: {order.orderItems.length}</h6>
            </div>

            <div>
                <h6># of Items: {order.orderItems.reduce((total, orderItem) => {
                    return total + Number(orderItem.quantity)
                },0)}</h6>
            </div>

            <div>
                <h6 className="d-inline">Total: </h6><h6 className="d-inline"> &#8369; {displayAmt(order.totalAmount)}</h6>
            </div>

            <AdminOrderItem orderItems={order.orderItems} showOrderItems={showOrderItems}/>

        </Col>
    )
}