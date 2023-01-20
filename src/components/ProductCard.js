import {useState, useEffect} from 'react';
import { Card, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

import {Link} from 'react-router-dom';

import '../css/ProductCard.css';

export default function ProductCard({product, searchParams}) {

	const {name, description, price, _id} = product;

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
            <div className="text-center">
                <Button className="bg-primary my-3 w-fit" as={Link} to={`/products/${_id}?field=${field}&isAsc=${isAsc}`} >
                    Details
                </Button>
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
