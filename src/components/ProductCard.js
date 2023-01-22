
import { Card, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import { useContext , useState} from 'react';

import {Link} from 'react-router-dom';

import '../css/ProductCard.css';

import UserContext from '../UserContext';

import Spinner from '../utils/Spinner';

import Swal from 'sweetalert2';

export default function ProductCard({product, searchParams}) {

	const {name, description, price, _id} = product;

    const {cart, setIsCartLoading, refreshCart, setShowCart, user} = useContext(UserContext);

    const isInCart = cart.find(cartItem => {
        if (cartItem.productId != product._id) {
            return false;
        } 

        return true
    })

    const [isCartBtnLoading, setIsCartBtnLoading] = useState(false);

    function addToCart(productId) {
        console.log('adding to cart')

        setIsCartBtnLoading(true);

        setIsCartLoading(true);
 
        fetch(`/users/cart`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                productId: productId,
                quantity: 1
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

                    refreshCart(() => {
                        setIsCartBtnLoading(false)
                    })
                    setShowCart(true);
                    //navigate('/courses');

                } else {
                    setIsCartLoading(false);
                    setIsCartBtnLoading(false);
                    Swal.fire({
                        title: data.error,
                        icon: "error",
                        text: "Please try again."
                    })

                }

            })



    }

    const [field, isAsc] = [searchParams.get('field'), searchParams.get('isAsc')]
	return (
        <Card className="h-100">
            <Card.Body className="">
                <Card.Title>{name}</Card.Title>

                <div>
                <Card.Subtitle className="d-inline">Description:</Card.Subtitle>
                <Card.Text className="d-inline"> {description}</Card.Text>
                </div>

                <div>
                <Card.Subtitle className="d-inline">Price:</Card.Subtitle>
                <Card.Text className="d-inline"> &#8369; {Intl.NumberFormat('en-US', {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                            }).format(price)}</Card.Text>
                </div>



                {/* <Card.Text>Enrollees: {count}</Card.Text>
                <Card.Text>Seats: {seats}</Card.Text>
                <Button id={'btn-enroll-' + id} className="bg-primary" onClick={enroll}>Enroll</Button> */}
            </Card.Body>
            <div className="d-flex justify-content-around">
            <div className="text-center">
                <Button className="bg-primary my-3 w-fit" as={Link} to={`/products/${_id}?field=${field}&isAsc=${isAsc}`} >
                    Details
                </Button>
            </div>
            
            {isInCart || user.isAdmin ? '' : 
            <>
                {isCartBtnLoading ? <Spinner small={true}/>
                :
                    <div className="text-center">
                    <Button onClick={e => {
                        addToCart(_id);
                    }} className="bg-success my-3 w-fit">
                            <strong>+</strong> &#128722;
                    </Button>
                </div>

                }
                </>

            }

            </div>


        </Card>
	)
}

// "proptypes" - are a good way of checking data type of information between components.
ProductCard.propTypes = {
	// "shape" method is used to check if prop object conforms to a specific "shape"
	product: PropTypes.shape({
        _id: PropTypes.string.isRequired,
		// Defined properties and their expected types
		name: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
		price: PropTypes.number.isRequired
	})
}
