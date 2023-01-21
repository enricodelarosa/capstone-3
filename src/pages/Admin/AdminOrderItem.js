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
                        <p className="my-0">{orderItem.name}</p>
        
                        <p className="my-0">Unit Price: {orderItem.unitPrice}</p>
        
                        <p className="my-0">Quanity: {orderItem.quantity}</p>
        
                        <p className="my-0">
                            Sub Total: &#8369; {displayAmt(orderItem.subTotal)}
                        </p >
                    </div>
        
                </div>

                )


            })
        }
        </div>

    )
}