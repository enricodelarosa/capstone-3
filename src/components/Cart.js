import {useState, useEffect, useContext} from 'react';

import UserContext from '../UserContext';

import Spinner from '../utils/Spinner';


export default function Cart({cart}) {
    const {refreshCart, setIsCartLoading} = useContext(UserContext);

    function toDisplayAmt(amount) {
        return Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            }).format(amount)
    }

    function handleRemove(productId) {
        
        fetch(`/users/cart/${productId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            console.log('deletign from cart')

            if (data.success) {
                refreshCart();
            }


        })

       



    }


    function handleChange(quantity,productId) {

        
        fetch(`/users/cart/${productId}?quantity=${quantity}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            console.log('updating cart')

            if (data.success) {
                refreshCart();
            }


        })
        
    }

    return (
        <>

            {(cart == null) ?
                <Spinner/>
            :
                cart.map(cartItem => {
                    return (
                        <div key={cartItem.productId} className="border border-dark my-2 rounded p-2 position-relative">

                            
 
                            <button type="button" className="btn-close position-absolute top-0 end-0 m-2" aria-label="Close" onClick={e => {
                                handleRemove(cartItem.productId)
                            }}></button>

                            <h1>{cartItem.name}</h1>


                            <h5> {toDisplayAmt(cartItem.price)}</h5>

                            <h5 className="d-inline-block">Quantity &nbsp;</h5>

                            <div className="input-group justify-content-start d-inline">
                                <input type="button" value={`${cartItem.quantity == 1 ? ' ' : '-'}`} className="button-minus" data-field="quantity"
                                onClick={ e => {
                                    if (cartItem.quantity == 1) {
                                        return;
                                    }
                                    handleChange(cartItem.quantity - 1, cartItem.productId)
                                }} 
                                />

                                <input type="number" min="1" max="" name="quantity" className="quantity-field" value={cartItem.quantity} onChange={e => {
                                    handleChange(e.target.value, cartItem.productId)
                                }}
                                    
                                />

                                <input type="button" value="+" className="button-plus" data-field="quantity" 
                                onClick={e => {
                                    handleChange(cartItem.quantity + 1, cartItem.productId)
                                }}/>
                            </div>

                            <h5>Sub Total: &#8369; {toDisplayAmt(cartItem.subTotal)}</h5>
                        </div>
                    )
                })
            }
        </>
        
    )
}