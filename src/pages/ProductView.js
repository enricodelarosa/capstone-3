import { useState , useEffect, useContext} from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

import UserContext from '../UserContext';

import {useParams, useNavigate, Link} from 'react-router-dom';

import Content from '../layout/Content';

import Swal from 'sweetalert2';

import '../css/ProductView.css';

export default function ProductView() {

    const navigate = useNavigate();

    const {user, cart, refreshCart, setShowCart} = useContext(UserContext);


    const {productId} = useParams();
	
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);


    const [quantity, setQuantity] = useState(1);

    const [newQuantity, setNewQuantity] = useState(1);

    const [activateUpdate, setActivateUpdate] = useState(false);

    const [inCart, setInCart] = useState(false);

    const displayPrice =  price.toFixed(2);

    useEffect(() => {

        console.log(cart);

        console.log(productId);

        const foundProduct = cart.find(product => {
            return product.productId === productId
        })

        if (foundProduct) {
            setInCart(true);
            setQuantity(foundProduct.quantity);
            setNewQuantity(foundProduct.quantity);
        } else {
            setInCart(false);
            setQuantity(1);
            setNewQuantity(1);

        }
    },[cart, productId])

    useEffect(() => {

        fetch(`/products/${productId}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);

            setName(data.name);
            setDescription(data.description);
            setPrice(data.price);
        })

    }, [productId]);

    useEffect(() => {
        if (quantity !== newQuantity) {
            setActivateUpdate(true);
        } else {
            setActivateUpdate(false);
        }
    },[quantity, newQuantity])

    function updateCart(productId) {
        fetch(`/users/cart/${productId}?quantity=${quantity}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                productId: productId,
                quantity: quantity
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            if (data.success === true) {
                Swal.fire({
                    title: "Cart updated",
                    icon: "success",
                    text: "Quantity of product updated."
                })
                
                refreshCart();
                setShowCart(true);
                //navigate('/courses');

            } else {
                Swal.fire({
                    title: "Error occured",
                    icon: "error",
                    text: "Please try again."
                })        

            }

        })

    }

    function deleteFromCart(productId) {
        fetch(`/users/cart/${productId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            if (data.success === true) {
                Swal.fire({
                    title: "Removed from Cart",
                    icon: "success",
                    text: "Product was removed from cart."
                })
                
                refreshCart();
                setShowCart(true);

            } else {
                Swal.fire({
                    title: "Error occured",
                    icon: "error",
                    text: "Please try again."
                })        

            }

        })


    }

    function addToCart(productId) {
        fetch(`/users/cart`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                productId: productId,
                quantity: quantity
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);

            if (data.success === true) {
                Swal.fire({
                    title: "Added to cart",
                    icon: "success",
                    text: "Product is in your cart."
                })
                
                refreshCart()
                setShowCart(true);
                //navigate('/courses');

            } else {
                Swal.fire({
                    title: data.error,
                    icon: "error",
                    text: "Please try again."
                })        

            }

        })


    }

    function handleMinus() {
        if (quantity <= 1) {
            return;
        }

        setQuantity(quantity - 1);

    }

    
    function handlePlus() {
        setQuantity(quantity + 1);

    }

    return (
        <Content>
			<Row>
				<Col lg={{span: 6, offset:3}} >
					<Card>
					      <Card.Body className="text-center">
					        <Card.Title>{name}</Card.Title>
					        <Card.Subtitle>Description:</Card.Subtitle>
					        <Card.Text>{description}</Card.Text>
					        <Card.Subtitle>Price:</Card.Subtitle>
					        <Card.Text>&#8369; {Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                            }).format(displayPrice)}</Card.Text>
                            
                            <div className="input-group justify-content-center">

                            <input type="button" value="-" className="button-minus" data-field="quantity" onClick={handleMinus}/>

                            <input type="number" min="1" max="" value={quantity} name="quantity" className="quantity-field" onChange={e => {
                                if (e.target.value <= 0) {
                                    //setQuantity(quantity);
                                    return
                                }
                                setQuantity(Number(e.target.value));
                            }}/>

                            <input type="button" value="+" className="button-plus" data-field="quantity" onClick={handlePlus}/>
                            </div>

					        
					        {
					        	(user.id !== null) ?
                                    (inCart === false) ?
					        		    <Button variant="primary" onClick={() => addToCart(productId)} >Add to Cart</Button>
                                        :

                                        <div className="d-flex flex-column">
                                        <div>
                                        <Button className="my-2" disabled={!activateUpdate} variant="primary" onClick={() => updateCart(productId)} >Update Cart</Button>
                                        </div>

                                        <div>
                                        <Button className="my-2" variant="danger" onClick={() => deleteFromCart(productId)} >Remove from Cart</Button>
                                        </div>
                                        </div>

					        		:
					        		<Button className="btn btn-danger" as={Link} to="/login"  >Log in to Use Cart</Button>
					        }

					      </Card.Body>
					</Card>
				</Col>
			</Row>
        </Content>

    )

}