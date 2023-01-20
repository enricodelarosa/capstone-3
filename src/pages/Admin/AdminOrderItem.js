import {useState} from 'react';

import {displayAmt} from '../../utils/display';

export default function AdminOrderItem({orderItems, showOrderItems}) {


    return (
        <div hidden={!showOrderItems}>
        {
            orderItems.map(orderItem => {

                return (
                <div className="my-2" key={orderItem._id} >
                    <div className="border rounded my-1 px-2 py-1" style={{backgroundColor: '#FFF6BF'}}>
                        <p>{orderItem.name}</p>
        
                        <p>Unit Price: {orderItem.unitPrice}</p>
        
                        <p>Quanity: {orderItem.quantity}</p>
        
                        <p>
                            Sub Total: &#8369; {displayAmt(orderItem.subTotal)}
                        </p>
                    </div>
        
                </div>

                )


            })
        }
        </div>

    )
}