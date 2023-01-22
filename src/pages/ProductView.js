import { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';

import UserContext from '../UserContext';

import { useParams, useNavigate, Link } from 'react-router-dom';

import Content from '../layout/Content';

import Swal from 'sweetalert2';

import '../css/ProductView.css';

import Spinner from '../utils/Spinner';

import Carousel from 'react-bootstrap/Carousel';

import {useSearchParams} from 'react-router-dom';



export default function ProductView() {

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    const [isLoading, setIsLoading] = useState(false);

    const { user, cart, refreshCart, setShowCart, setIsCartLoading } = useContext(UserContext);


    let { productId } = useParams();

    // const [name, setName] = useState("");
    // const [description, setDescription] = useState("");
    // const [price, setPrice] = useState(0);

    const [product, setProduct] = useState(null);

    const [idBefore, setIdBefore] = useState(null);

    const [idAfter, setIdAfter] = useState(null);

    const [quantity, setQuantity] = useState(0);
    const [newQuantity, setNewQuantity] = useState(1);

    const [activateUpdate, setActivateUpdate] = useState(false);

    const [inCart, setInCart] = useState(false);

    const [isNavLoading, setIsNavLoading] = useState(false);

    useEffect(() => {

        console.log(cart);

        console.log(productId);

        if (cart === null) {
            return;
        }


        const foundProduct = cart.find(product => {
        return product.productId === productId
        })

        if (foundProduct) {
            setInCart(true);
            setQuantity(foundProduct.quantity);
            setNewQuantity(foundProduct.quantity);
        } else {
            setInCart(false);
            setQuantity(0);
            setNewQuantity(1);

        }
    }, [cart, productId])

    useEffect(() => {


        if (searchParams.get('field') == null || searchParams.get('isAsc') == null) {
            setSearchParams(`?${new URLSearchParams({ field: 'name' })}&${new URLSearchParams({ isAsc: 1 })}`)
        }

        
    },[setSearchParams,searchParams])

    useEffect(() => {



        let field = searchParams.get('field') 
        let  isAsc = searchParams.get('isAsc')

        field = field == null ? 'name' : field;
        isAsc = isAsc == null ? '1' : isAsc;

        fetch(`/products/${productId}?field=${field}&isAsc=${isAsc}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                
                const {product, productIdBefore, productIdAfter} = data;

                setIdAfter(productIdAfter);
                setIdBefore(productIdBefore);

                setProduct({ name: product.name, description: product.description, price: product.price});
                setIsNavLoading(false);

                
            })

    }, [productId]);

    useEffect(() => {
        if (quantity !== newQuantity) {
            setActivateUpdate(true);
        } else {
            setActivateUpdate(false);
        }
    }, [quantity, newQuantity])

    function updateCart(productId) {
        setIsCartLoading(true);
        setIsLoading(true);
        console.log(newQuantity);
        fetch(`/users/cart/${productId}?quantity=${newQuantity}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setIsLoading(false);
                if (data.success === true) {
                    Swal.fire({
                        title: "Cart updated",
                        icon: "success",
                        text: "Quantity of product updated."
                    })

                    refreshCart(() => {setIsLoading(false)});
                    setShowCart(true);
                    //navigate('/courses');

                } else {
                    setIsLoading(false);
                    setIsCartLoading(false);
                    Swal.fire({
                        title: "Error occured",
                        icon: "error",
                        text: "Please try again."

                    })



                }

            })



    }

    function deleteFromCart(productId) {
        setIsCartLoading(true);
        setIsLoading(true);
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
                setIsLoading(false);
                if (data.success === true) {
                    Swal.fire({
                        title: "Removed from Cart",
                        icon: "success",
                        text: "Product was removed from cart."
                    })

                    refreshCart();
                    setShowCart(true);

                } else {

                    setIsCartLoading(false);
                    Swal.fire({
                        title: "Error occured",
                        icon: "error",
                        text: "Please try again."
                    })

                }

            })



    }

    function addToCart(productId) {

        console.log('Adding to cart', productId, newQuantity);
        setIsCartLoading(true);
        setIsLoading(true);
        fetch(`/users/cart`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                productId: productId,
                quantity: newQuantity
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setIsLoading(false);
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
                    setIsCartLoading(false);
                    Swal.fire({
                        title: data.error,
                        icon: "error",
                        text: "Please try again."
                    })

                }

            })


    }

    function handleMinus() {
        if (newQuantity <= 1) {
            return;
        }

        setNewQuantity(newQuantity - 1);

    }

    function move(productId) {

        const field = searchParams.get('field');
        const isAsc = searchParams.get('isAsc');


        setIsNavLoading(true);
        navigate(`/products/${productId}?field=${field}&isAsc=${isAsc}`)
        
    }


    function handlePlus() {
        setNewQuantity(newQuantity + 1);

    }

    return (
        <Content>
            <Row>
                <Col lg={{ span: 6, offset: 3 }} >
                    {(product == null || isNavLoading) ?
                    <Spinner/>
                    :

                        <Card className="d-flex flex-row position-relative">
                        
                            {idBefore &&
                                <div className="position-absolute" onClick={e => {move(idBefore)}} style={{left: '1rem', top: '30%', cursor: 'pointer'}}><h1 style={{fontSize: '5rem'}}>&lt;</h1></div>

                            }
                            
                            <Card.Body className="text-center">
                                
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Subtitle>Description:</Card.Subtitle>
                                <Card.Text>{product.description}</Card.Text>
                                <Card.Subtitle>Price:</Card.Subtitle>
                                <Card.Text>&#8369; {Intl.NumberFormat('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(product.price.toFixed(2))}</Card.Text>

                                <div className="input-group justify-content-center">

                                    <input type="button" value="-" className="button-minus" data-field="quantity" onClick={handleMinus} />

                                    <input type="number" min="1" max="" value={newQuantity} name="quantity" className="quantity-field" onChange={e => {
                                        if (e.target.value <= 0) {
                                            //setQuantity(quantity);
                                            return
                                        }
                                        setNewQuantity(Number(e.target.value));
                                    }} />

                                    <input type="button" value="+" className="button-plus" data-field="quantity" onClick={handlePlus} />
                                </div>


                                {
                                    (user.id !== null) ?
                                        (inCart === false) ?

                                            (isLoading) ?
                                                <Spinner />
                                                :
                                                <Button variant="primary" onClick={() => addToCart(productId)} >Add to Cart</Button>
                                            :
                                            (isLoading) ?
                                                <Spinner />
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
                                        <Button className="btn btn-danger" as={Link} to={`/login?view=${productId}`}>Log in to Order</Button>
                                }


                               
                            </Card.Body>

                            {idAfter &&

                                <div className="position-absolute" onClick={e => {move(idAfter)}} style ={{right: '1rem', top: '30%', cursor: 'pointer'}}><h1 style={{fontSize: '5rem'}}>&gt;</h1></div>

                            }
                            
                        </Card>

                    }

                </Col>
            </Row>
        </Content>

    )

}