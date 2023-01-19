import {useState, useEffect, useContext} from 'react';

import UserContext from '../UserContext';

import Spinner from '../utils/Spinner';

import CartItem from './CartItem';

export default function Cart({cart}) {
    const {refreshCart, setIsCartLoading} = useContext(UserContext);

    

    return (
        <>

            {(cart == null) ?
                <Spinner/>
            :
                cart.map(cartItem => {
                    return (

                        <CartItem key={cartItem.productId} cartItem={cartItem}/>
                        
                    )
                })
            }
        </>
        
    )
}