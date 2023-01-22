
import {useState, useEffect, useContext} from 'react';

import UserContext from '../UserContext';
import Spinner from '../utils/Spinner';
import Swal from 'sweetalert2';

import {Row} from 'react-bootstrap';

export default function CartItem({cartItem}) {

    const {refreshCart, setIsCheckoutButtonDisabled} = useContext(UserContext);

    const [isQLoading, setIsQLoading] = useState(false);

    const [isCTLoading, setIsCTLoading] = useState(false);

    const [displayQuantity, setDisplayQuantity] = useState(cartItem.quantity);
    //const [submitQuantity, setSubmitQuantity] = useState(cartItem.quantity);

    useEffect(() => {
        if (cartItem !== null) {
            setDisplayQuantity(cartItem.quantity);
            if (cartItem.isActive == false) {
                setIsCheckoutButtonDisabled(true)
            }
        }

    },[cartItem])



    useEffect(() => {

        if (document.getElementById(`quantity-${cartItem.productId}`) != null) {
            document.getElementById(`quantity-${cartItem.productId}`).value = cartItem.quantity;

        }


    }, [cartItem])

    function toDisplayAmt(amount) {
        return Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            }).format(amount)
    }

    function handleRemove(productId) {
        setIsCheckoutButtonDisabled(true);
        setIsCTLoading(true)
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
                refreshCart(() => {
                    setIsCTLoading(false);
                });
            } else {
                Swal.fire({
                title: "Deletion Error",
                icon: "error",
                text: "Please try again."
                }) 

            }

            
        })

       



    }



    function updateCartQuantity(productId, quantity) {

        if (quantity <= 0) {
            Swal.fire({
                title: "Cart item cannot be 0 or negative",
                icon: "error",
                text: "Please set correct cart amount."
                }) 
            refreshCart();
            return


        }

        setIsQLoading(true);
        setIsCheckoutButtonDisabled(true);

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
                    refreshCart(() => {
                        setIsQLoading(false);
                    });
                } 




            })
    }


    let quantityUpdateTimeout;

    function updateQuantity(productId, quantity) {
        
        clearTimeout(quantityUpdateTimeout);

        quantityUpdateTimeout = setTimeout(() => {
            
            console.log('Mock function running updateing this in cart ' + productId + ` to ${quantity} pcs`);
            updateCartQuantity(productId,quantity)
            
        }, 1500)

        

    }

    
    return (
        <>
        {(isCTLoading) ?
        <div className="ml-12"> 
        <Spinner />
        </div>

        :
        <div className={`border border-dark my-2 rounded p-2 position-relative`} style={cartItem.isActive ? {backgroundColor: 'white'} : {backgroundColor: '#D3D3D3'}}>



            <button type="button" className="btn-close position-absolute top-0 end-0 m-2" aria-label="Close" onClick={e => {
                handleRemove(cartItem.productId)
            }}></button>

                <span className=" w-75" style={!cartItem.isActive ? {display :'inline-block', color: '#8b0000'} : {display :'none'}}>Product not available. Please delete from your cart to be able to checkout</span>
            <h1>{cartItem.name}</h1>


            <h5> {toDisplayAmt(cartItem.price)}</h5>



                
            {!cartItem.isActive ?
            ''
            :
            <>
            <h5 className="d-inline-block">Quantity &nbsp;</h5>
            <div className="input-group justify-content-start d-inline">
               { (isQLoading) ? 
                <Spinner small={true}/>
                    :   

                    <>
                <input type="button" value={`${displayQuantity=== 1 ? ' ' : '-'}`} className="button-minus" hidden={(displayQuantity === 1) ? true : false} data-field="quantity"
                    onClick={e => {

                        const quantityElement = document.getElementById(`quantity-${cartItem.productId}`);

                        quantityElement.value = Number(quantityElement.value) - 1;

                        updateQuantity(cartItem.productId,quantityElement.value);

                    }}
                        // setNewQuantity(Number(newQuantity) - 1);

                        // handleChange(cartItem.productI}
                />

                <input id={`quantity-${cartItem.productId}`} type="number" min="1" max="" name="quantity" className="quantity-field" 
                onChange={e => 
                    { 
                        
                        updateQuantity(cartItem.productId, e.target.value);
                        // handleChange(cartItem.productId, newQuantity)
                        
                    }}
                />

                <input type="button" value="+" className="button-plus" data-field="quantity"
                    onClick={e => {
                        const quantityElement = document.getElementById(`quantity-${cartItem.productId}`);

                        quantityElement.value = Number(quantityElement.value) + 1;

                        updateQuantity(cartItem.productId,quantityElement.value);

                    }} />
                </>
                }
            </div>
            
        
            

        

            <h5>Sub Total: &#8369; {toDisplayAmt(cartItem.subTotal)}</h5>
            </>
            }
        </div>

        }
        </>


    )
}